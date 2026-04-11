from datetime import datetime

from django.db.models import OuterRef, Subquery
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from .models import Portfolio, Asset, Transaction, Holding, StockPrice, PortfolioSnapshot


def apply_transaction(*, portfolio: Portfolio, asset: Asset, tx_type: str, transaction_date: datetime.date, shares: Decimal, price: Decimal):
    shares = Decimal(shares)
    price = Decimal(price)

    with transaction.atomic():
        if tx_type == Transaction.BUY:
            # Create new lot
            Holding.objects.create(
                portfolio=portfolio,
                asset=asset,
                shares=shares,
                remaining_shares=shares,
                buy_price=price,
                buy_date=transaction_date
            )

        elif tx_type == Transaction.SELL:
            # Fetch lots in FIFO order
            lots = Holding.objects.select_for_update().filter(
                portfolio=portfolio,
                asset=asset,
                remaining_shares__gt=0
            ).order_by("buy_price")

            shares_to_sell = shares
            realized_pnl = Decimal("0")

            for lot in lots:
                if shares_to_sell <= 0:
                    break

                sell_qty = min(lot.remaining_shares, shares_to_sell)

                # Compute realized PnL per lot
                realized_pnl += (price - lot.buy_price) * sell_qty

                # Reduce lot remaining shares
                lot.remaining_shares -= sell_qty
                lot.save()

                if lot.remaining_shares <= 0:
                    lot.delete()
                else:
                    lot.save()

                shares_to_sell -= sell_qty

            if shares_to_sell > 0:
                raise ValueError(f"Not enough shares to sell. {shares_to_sell} shares short.")

            # Update portfolio realized PnL
            portfolio.realized_pnl += realized_pnl
            portfolio.save()

        else:
            raise ValueError("Invalid transaction type")

        # Always record the transaction
        Transaction.objects.create(
            portfolio=portfolio,
            asset=asset,
            transaction_type=tx_type,
            transaction_date=transaction_date,
            shares=shares,
            price=price
        )



@transaction.atomic
def create_sod_snapshots():
    portfolios = Portfolio.objects.select_for_update().all()

    # Subquery to get latest price per asset
    latest_price_subquery = StockPrice.objects.filter(
        symbol=OuterRef("asset__symbol")
    ).order_by("-date").values("price")[:1]

    # Annotate holdings with latest price
    holdings = Holding.objects.select_related("portfolio", "asset").annotate(
        latest_price=Subquery(latest_price_subquery)
    )

    # Aggregate per portfolio
    portfolio_values = {}

    for h in holdings:
        if h.latest_price is None:
            continue

        value = h.remaining_shares * h.latest_price

        portfolio_values.setdefault(h.portfolio_id, Decimal("0"))
        portfolio_values[h.portfolio_id] += value

    # Update portfolios + snapshots
    snapshots = []
    now = timezone.now() 
    print("Computed timestamp:", now)

    for portfolio in portfolios:
        total_value = portfolio_values.get(portfolio.id, Decimal("0"))

        portfolio.total_value = total_value
        portfolio.save(update_fields=["total_value"])

        snapshots.append(
            PortfolioSnapshot(
                portfolio=portfolio,
                cash_balance=Decimal("0"),
                investment_balance=total_value,
                total_value=total_value,
                timestamp=now
            )
        )

    PortfolioSnapshot.objects.bulk_create(snapshots)