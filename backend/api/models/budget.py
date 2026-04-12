from django.db import models
from django.contrib.auth.models import User


class BudgetProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="budget_profile")
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"BudgetProfile({self.user.username}, income={self.monthly_income})"


class BudgetTransaction(models.Model):
    CATEGORY_CHOICES = [
        ("HOUSING", "Housing"),
        ("TRANSPORTATION", "Transportation"),
        ("INSURANCE", "Insurance"),
        ("UTILITIES", "Utilities"),
        ("FOOD", "Food"),
        ("OTHER", "Other"),
        ("INCOME", "Income"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budget_transactions")
    date = models.DateField()
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["user", "category"]),
        ]

    def __str__(self):
        return f"{self.user.username} | {self.date} | {self.item} | {self.category} | ${self.amount}"