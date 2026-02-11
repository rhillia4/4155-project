import random
import string
from decimal import Decimal


def calculate_portfolio_value(portfolio, price_lookup):
    """
    price_lookup: dict { 'AAPL': Decimal('182.50'), ... }
    """
    total = portfolio.cash_balance

    for holding in portfolio.holdings.all():
        price = price_lookup.get(holding.asset.symbol, Decimal("0"))
        total += holding.shares * price

    return total

def format_currency(value):
    return "${:,.2f}".format(value)

def game_leaderboard(game, price_lookup):
    leaderboard = []

    for participant in game.participants.select_related("portfolio"):
        portfolio = participant.portfolio
        value = calculate_portfolio_value(portfolio, price_lookup)

        leaderboard.append({
            "portfolio_id": portfolio.id,
            "portfolio_name": portfolio.name,
            "user": portfolio.user.username,
            "total_value": value,
        })

    return sorted(leaderboard, key=lambda x: x["total_value"], reverse=True)


def generate_game_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
