import sys
import time
import argparse #
from datetime import datetime, timedelta
from db import DB_QUERY
import asyncio
import aiohttp
import random
import inspect
import base64
import io
import csv
import os

FMP_API_BASE_URL = os.getenv("FMP_API_BASE_URL")
FMP_API_KEY = os.getenv("FMP_API_KEY")



async def main():
    pool = await DB_QUERY.connect_db()
    tickers = await DB_QUERY.get_tickers(pool)
    print(len(tickers))
    pass



class RateLimiter:
    def __init__(self, rate_per_sec):
        self.delay = 1 / rate_per_sec
        self.last = 0
        self.lock = asyncio.Lock()

    async def wait(self):
        async with self.lock:
            now = time.monotonic()
            wait_time = self.delay - (now - self.last)
            if wait_time > 0:
                await asyncio.sleep(wait_time)
            self.last = time.monotonic()


# JSON responses (most endpoints)
def process_json(response):
    return response  # default: just return parsed JSON

# CSV responses (for bulk endpoints)
def process_csv(text):
    f = io.StringIO(text)
    reader = csv.DictReader(f)
    return list(reader)


async def fetch_dataset(tasks, session, max_concurrent):
    queue = asyncio.Queue()
    results = []
    errors = []

    for task in tasks:
        await queue.put(task)

    sem = asyncio.Semaphore(max_concurrent)

    # Global rate limiter
    global_limiter = RateLimiter(50)


    async def worker():
        while True:
            task = await queue.get()
            if task is None:
                queue.task_done()
                break

            db_table_name, url, process_func, *args = task

            try:
                async with sem:
                    await global_limiter.wait()   # ✅ ONLY PLACE

                    async with session.get(url) as resp:
                        if resp.status == 429:
                            retry_after = int(resp.headers.get("Retry-After", 1))
                            await asyncio.sleep(retry_after * (1 + random.random()))
                            await queue.put(task)
                            continue
                        elif resp.status == 404:
                            errors.append(f"{url}: 404 Not Found")
                            continue


                        resp.raise_for_status()

                        if process_func == process_csv:
                            data = process_func(await resp.text())
                        else:
                            data = process_func(await resp.json())

                        results.append([db_table_name, data])

            except Exception as e:
                errors.append(f"{url}: {e}")

            finally:
                queue.task_done()

    workers = [asyncio.create_task(worker()) for _ in range(max_concurrent)]
    await queue.join()

    for _ in workers:
        await queue.put(None)
    for w in workers:
        await w

    return results, errors

async def generic_load_script(start_time, data, http_errors, pool):
    all_errors = {"http_errors": http_errors or ["No errors"]}
    loader_metadata = {
        # "api_asset": {"insertFunc": "insert_asset", "rows" : []},
        "api_stockprice": {"insertFunc": "insert_stock_price_data", "rows" : []},
    }    

    for row in data:
        loader_metadata[row[0]]["rows"].append(row[1])
        
    all_truncated_cols = set()
    all_out_of_range_cols = set()
    for db_table in loader_metadata.values(): 

        total_rows = 0
        rows_inserted = 0
        rows_updated = 0
        rows_deleted = 0
        error_message = None   
        errors = []
        

        insert_func = getattr(DB_QUERY, db_table.get("insertFunc"), None)
        if insert_func is None or not callable(insert_func):
            raise ValueError(f"Insert function '{db_table.get('insertFunc')}' not found in DB_QUERY")
        dataset = db_table.get("rows")
        total_rows = len(dataset)
        try:
                # Insert batch
                if inspect.iscoroutinefunction(insert_func):
                    inserted, updated, insert_error, truncated_cols, out_of_range_cols = await insert_func(dataset, pool)
                else:
                    inserted, updated, insert_error, truncated_cols, out_of_range_cols = insert_func(dataset, pool)
                rows_inserted += inserted
                rows_updated += updated
                if insert_error:
                    errors.append(f"Batch insert error: {insert_error}")
                if truncated_cols:
                    all_truncated_cols.update(truncated_cols)
                if out_of_range_cols:
                    all_out_of_range_cols.update(out_of_range_cols)
                
                    
        except Exception as e:
            error_message = str(e)

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        minutes, seconds = divmod(int(duration), 60)
        duration_formatted = f"{minutes} min {seconds} secs"
        print(f"{db_table.get('insertFunc')} completed in {duration_formatted}")

        
        all_errors[db_table.get("dbTableCode")] = errors or ["No errors"]
    return all_errors, all_truncated_cols, all_out_of_range_cols

def get_historical_price_url(symbol, to_date, from_date=None):
    if from_date is None and to_date is None:
        return FMP_API_BASE_URL + f"api/v3/historical-price-full/{symbol}?from=0000-01-01&apikey={FMP_API_KEY}"
    elif to_date is None:
        return FMP_API_BASE_URL + f"api/v3/historical-price-full/{symbol}?to={from_date}&apikey={FMP_API_KEY}"
    return FMP_API_BASE_URL + f"api/v3/historical-price-full/{symbol}?from={from_date}&to={to_date}&apikey={FMP_API_KEY}"

async def load_all_stocks(to_date=(datetime.now() - timedelta(days= 1)).strftime("%Y-%m-%d"), from_date=(datetime.now() - timedelta(days= 3)).strftime("%Y-%m-%d")):
    start_time = datetime.now()
    all_error_log = {}
    all_truncated_cols = set()
    all_out_of_range_cols = set()

    pool = await DB_QUERY.connect_db()
    symbols = await DB_QUERY.get_tickers(pool)


    tasks = []
    # tasks.append(("api_asset", f"{FMP_API_BASE_URL}stable/sp500-constituent?apikey={FMP_API_KEY}", process_json))
    for symbol in symbols:
        tasks.append(("api_stockprice", get_historical_price_url(symbol, to_date, from_date), process_json))



    async with aiohttp.ClientSession() as session:
        results, errors = await fetch_dataset(tasks, session, max_concurrent=15)

        
    

    # Now insert results into DB (example: you could iterate over results)
        errors, truncated_cols, out_of_range_cols = await generic_load_script(
            start_time=start_time,
            data=results,
            http_errors=errors,
            pool=pool,
        )

        all_error_log = errors
        all_truncated_cols.update(truncated_cols)
        all_out_of_range_cols.update(out_of_range_cols)

    duration = (datetime.now() - start_time).total_seconds()
    minutes, seconds = divmod(int(duration), 60)
    duration_formatted = f"{minutes} min {seconds} secs"



    print(f"Completed {len(tasks)} tasks in {duration_formatted}")
    return  all_error_log, all_truncated_cols, all_out_of_range_cols
    

async def daily():
     await load_all_stocks()

async def all_data():
    all_errors, all_truncated_cols, all_out_of_range_cols = await load_all_stocks(to_date=None, from_date=None)
    print("\n---------------------------\n")
    print(all_errors)
    print("\n---------------------------\n")
    print("Truncated warnings: ")
    print(all_truncated_cols)
    print("\n---------------------------\n")
    print("Out of range warnings: ")
    print(all_out_of_range_cols)
    print("\n---------------------------\n")

async def custom_limit_load(limit, from_date):
     await load_all_stocks(limit, from_date)




if __name__ == "__main__":
    if len(sys.argv) == 2:
        func_name = sys.argv[1]
        if func_name in globals() and callable(globals()[func_name]):
            asyncio.run(globals()[func_name]())
        else:
            print(f"❌ Function/ticker '{func_name.strip().upper()}' not found.")
    elif len(sys.argv) == 3:
        parser = argparse.ArgumentParser()
        parser.add_argument("--frequency", choices=["daily", "quarterly", "annual"], required=True)
        args = parser.parse_args()

        if args.frequency == "daily":
            asyncio.run(daily())
    else:
        print("No function called")