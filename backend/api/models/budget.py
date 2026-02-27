from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User 

class BudgetTransaction(models.Model):
    # Choices for transaction type
    TRANSACTION_TYPES = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]

    # Link to the specific user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    
    # Core fields
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    note = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type}: {self.amount}"
    
class BudgetEntry(models.Model):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

    TRANSACTION_TYPE_CHOICES = [
        (INCOME, "Income"),
        (EXPENSE, "Expense"),
    ]

    # Links back to the User ID (Django's default or custom user)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budget_entries"
    )
    
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(
        max_length=7, 
        choices=TRANSACTION_TYPE_CHOICES,
        default=EXPENSE
    )
    note = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type}: {self.amount}"