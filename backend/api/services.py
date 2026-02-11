from django.db import transaction
from decimal import Decimal
from .models import Portfolio, Holding, Transaction

@transaction.atomic
def execute_buy(portfolio: Portfolio, asset, shares: Decimal, price: Decimal):
    total_cost = shares * price

    if portfolio.cash_balance < total_cost:
        raise ValueError("Insufficient cash")

    holding, _ = Holding.objects.get_or_create(
        portfolio=portfolio,
        asset=asset,
        defaults={"shares": 0, "buy_price": price}
    )

    # weighted average cost
    new_total_shares = holding.shares + shares
    holding.average_cost = (
        (holding.shares * holding.average_cost) + total_cost
    ) / new_total_shares

    holding.shares = new_total_shares
    holding.save()

    portfolio.cash_balance -= total_cost
    portfolio.investment_balance += total_cost
    portfolio.save()

    Transaction.objects.create(
        portfolio=portfolio,
        asset=asset,
        transaction_type=Transaction.BUY,
        shares=shares,
        price=price
    )
