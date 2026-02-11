from django.db import models
from django.contrib.auth.models import User
from .game import Game

class Portfolio(models.Model):
    REAL = "REAL"
    PROP = "PROP"

    PORTFOLIO_TYPE_CHOICES = [
        (REAL, "Real"),
        (PROP, "Prop Money"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolios")
    name = models.CharField(max_length=100)
    portfolio_type = models.CharField(max_length=4, choices=PORTFOLIO_TYPE_CHOICES)
    cash_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    investment_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="portfolios",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "game")

    def __str__(self):
        return f"{self.name} ({self.portfolio_type})"

class PortfolioSnapshot(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="snapshots"
    )
    cash_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    investment_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    def __str__(self):
        return f"Snapshot of {self.portfolio.name} at {self.timestamp}"
    
