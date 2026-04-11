# serializers.py
from rest_framework import serializers
from .models import Portfolio, PortfolioSnapshot, Asset, Holding, Transaction, StockPrice, User

# --- Assets ---
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id", "symbol", "name"]

# --- Holdings (lot-based) ---
class HoldingLotSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(read_only=True)
    class Meta:
        model = Holding
        fields = [
            "id",
            "asset",
            "shares",
            "remaining_shares",
            "buy_price",
        ]
    
# Aggregated holdings per asset
class AggregatedHoldingSerializer(serializers.Serializer):
    asset_symbol = serializers.CharField()
    total_remaining_shares = serializers.DecimalField(max_digits=15, decimal_places=4)

# --- Portfolio ---
class PortfolioSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Portfolio
        fields = ["id", "name", "total_value", "realized_pnl", "user", "created_at"]
        read_only_fields = ["id", "user", "total_value", "realized_pnl", "created_at"]

# Portfolio detail with lots
class PortfolioDetailSerializer(serializers.ModelSerializer):
    holdings = HoldingLotSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "name", "total_value", "realized_pnl", "holdings"]

# --- Portfolio Snapshot ---
class PortfolioSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioSnapshot
        fields = "__all__"

# --- Transactions ---
class TransactionSerializer(serializers.ModelSerializer):
    asset_symbol = serializers.CharField(source="asset.symbol", read_only=True)
    executed_at = serializers.DateTimeField(format="%b %d, %Y", read_only=True)
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["portfolio", "executed_at"]

# --- Stock Prices ---
class StockPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPrice
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            # 'first_name': {'required': False},
            # 'last_name': {'required': False},
            'password': {'write_only': True},
        }
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user