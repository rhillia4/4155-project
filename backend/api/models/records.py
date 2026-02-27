from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from .brokerage import Portfolio
from django.conf import settings 

class Asset(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

class Holding(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="holdings"
    )
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    shares = models.DecimalField(max_digits=15, decimal_places=4)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ("portfolio", "asset")
        indexes = [
            models.Index(fields=["portfolio"]),
        ]
    def __str__(self):
        return f"{self.portfolio.name} - {self.asset.symbol}"


class Transaction(models.Model):
    BUY = "BUY"
    SELL = "SELL"

    TRANSACTION_TYPE_CHOICES = [
        (BUY, "Buy"),
        (SELL, "Sell"),
    ]

    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="transactions"
    )
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE_CHOICES)
    shares = models.DecimalField(max_digits=15, decimal_places=4)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["portfolio", "executed_at"]),
        ]

    def __str__(self):
        return f"{self.transaction_type} {self.asset.symbol}"

class StockPrice(models.Model):
    symbol = models.CharField(max_length=10, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(db_index=True)
    timestamp = models.DateTimeField(db_index=True, default=timezone.now)
    # To set default value of timestamp to CURRENT_TIMESTAMP in MySQL, use the following SQL command:
    # Needed to run the eod job without errors
    # ALTER TABLE api_stockprice
    # MODIFY timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

    class Meta:
        ordering = ["-date"]
        unique_together = ("symbol", "date") 
        indexes = [
            models.Index(fields=["symbol", "date"]),
        ]

    def save(self, *args, **kwargs):
        raise RuntimeError("StockPrice is read-only")

    def delete(self, *args, **kwargs):
        raise RuntimeError("StockPrice is read-only")