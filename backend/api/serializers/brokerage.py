from rest_framework import serializers
from ..models import (
    Portfolio,
    PortfolioSnapshot,
)

class PortfolioSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Portfolio
        fields = ["id", "name", "portfolio_type", "cash_balance", "user", "user_id", "game_id", "created_at", "investment_balance"]
        read_only_fields = ["id", "user", "created_at"]

class PortfolioSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioSnapshot
        fields = "__all__"
