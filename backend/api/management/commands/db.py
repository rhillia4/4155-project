import os
import aiomysql
import asyncio


from dotenv import load_dotenv
load_dotenv()

DEVELOPMENT = os.getenv("DEVELOPMENT", "false").lower() == "true"

DB_HOST =  os.getenv("DEV_DB_HOST") if DEVELOPMENT else os.getenv("DB_HOST")
DB_NAME =  os.getenv("DEV_DB_NAME") if DEVELOPMENT else os.getenv("DB_NAME")
DB_USER =  os.getenv("DEV_DB_USERNAME") if DEVELOPMENT else os.getenv("DB_USERNAME")
DB_PASS =  os.getenv("DEV_DB_PASSWORD") if DEVELOPMENT else os.getenv("DB_PASSWORD")


async def insert_generic_data_async(data, data_keys, pool, table_name, table_keys, update_fields, batch_size=500):
    """
    Async MySQL insert with ON DUPLICATE KEY UPDATE for batch insert using aiomysql.
    Returns: (rows_inserted, rows_updated, error_message)
    
    Parameters:
        data: List of datasets (each dataset is a list of dicts)
        data_keys: List of keys to extract from each record
        pool: aiomysql connection pool
        table_name: target MySQL table
        table_keys: list of column names in DB
        update_fields: fields to update on duplicate key
        batch_size: how many rows to insert per batch
    """
    # Build query parts
    placeholders = ", ".join(["%s"] * len(table_keys))
    columns = ", ".join(table_keys)
    update_clause = ", ".join([f"{field} = new.{field}" for field in update_fields])

    insert_query = f"""
        INSERT INTO {table_name} ({columns})
        VALUES ({placeholders}) as new
        ON DUPLICATE KEY UPDATE {update_clause}
    """

    # Flatten all records
    batch_values = []
    print("Data received for insertion:")
    for records in data:
        if isinstance(records, dict):
            for record in records.get("historical", []):
                batch_values.append([records["symbol"], *[record.get(k) for k in data_keys]])
        else:
            for record in records:
                batch_values.append([record.get(k) for k in data_keys])
    rows_inserted = 0
    rows_updated = 0
    error_message = None
    truncated_cols = set()   # ⬅️ MOVE HERE
    out_of_range_cols = set()


    try:
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                # Insert in batches
                for i in range(0, len(batch_values), batch_size):
                    chunk = batch_values[i:i + batch_size]
                    await cursor.executemany(insert_query, chunk)

                    await cursor.execute("SHOW WARNINGS")
                    warnings = await cursor.fetchall()

                    for _, _, msg in warnings:
                        if "Data truncated for column" in msg:
                            truncated_cols.add(msg.split("'")[1])
                        elif "Out of range value for column" in msg:
                            out_of_range_cols.add(msg.split("'")[1])

                    await conn.commit()

                    # Approximate inserted/updated rows
                    total_affected = cursor.rowcount
                    rows_inserted += len(chunk)
                    rows_updated += max(0, total_affected - len(chunk))
    except aiomysql.MySQLError as err:
        error_message = f"MySQL Error inserting into {table_name}: {err}"
        rows_inserted = 0
        rows_updated = 0
    return rows_inserted, rows_updated, error_message, truncated_cols, out_of_range_cols

class DB_QUERY:
# db connect 
    async def connect_db():
        pool = await aiomysql.create_pool(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            db=DB_NAME,
            port=3306,
            minsize=1,
            maxsize=10
        )
        return pool
    
# get statements
    # tickers
    async def get_tickers(pool):
        """
        Fetch all tickers from api_asset table.
        Returns a list of symbols.
        """
        select_query = "SELECT symbol FROM api_asset;"
        tickers = []

        try:
            async with pool.acquire() as conn:
                async with conn.cursor() as cursor:
                    await cursor.execute(select_query)
                    rows = await cursor.fetchall()
                    tickers = [row[0] for row in rows]

        except aiomysql.MySQLError as err:
            print(f"❌ MySQL Error selecting symbols from api_asset: {err}")

        return tickers



# insert statments
    # stock price
    async def insert_stock_price_data(data, pool):
        # IMPORTANT: wrap historical in a list
        return await insert_generic_data_async(
            data=data,                 # 👈 must be list of datasets
            data_keys=["close", "date"],
            pool=pool,
            table_name="api_stockprice",
            table_keys=["symbol", "price", "date"],
            update_fields=["price", "date"],   # 👈 FIXED
        )

    async def insert_asset(data, pool):
        return await insert_generic_data_async(
            data=data,
            data_keys=["symbol", "name"],
            pool=pool,
            table_name="api_asset",
            table_keys=["symbol", "name"],
            update_fields=["symbol", "name"]

        )
