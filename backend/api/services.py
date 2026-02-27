from django.db import transaction
from decimal import Decimal
from .models import Portfolio, Holding, Transaction
from django.db.models import Sum
from .models.records import BudgetEntry

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
#budget section

def get_budget_summary(user):
    """
    Calculates total income and total expenses for the user.
    """
    stats = BudgetEntry.objects.filter(user=user).values('transaction_type').annotate(
        total=Sum('amount')
    )
    # Formats: {'INCOME': 5000.00, 'EXPENSE': 3200.00}
    return {item['transaction_type']: item['total'] for item in stats}