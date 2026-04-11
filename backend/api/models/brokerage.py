from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolios")
    name = models.CharField(max_length=100)
    realized_pnl = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} ({self.total_value} USD)"


class PortfolioSnapshot(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="snapshots"
    )
    cash_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    investment_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Snapshot of {self.portfolio.name} at {self.timestamp}"