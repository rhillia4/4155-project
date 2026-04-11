from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from django.db.models import Sum, F
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import Portfolio, PortfolioSnapshot, Holding, Transaction, Asset, StockPrice
from .serializers import (
    PortfolioSerializer,
    PortfolioDetailSerializer,
    PortfolioSnapshotSerializer,
    HoldingLotSerializer,
    AggregatedHoldingSerializer,
    TransactionSerializer,
    AssetSerializer,
    StockPriceSerializer,
    UserSerializer,
    RegisterSerializer
)
from .services import apply_transaction

# --- Assets ---
class AssetListView(generics.ListAPIView):
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Asset.objects.all()


class AssetDetailView(generics.RetrieveAPIView):
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Asset.objects.filter(id=self.kwargs["id"])


# --- Portfolios ---
class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("Not your portfolio")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("Not your portfolio")
        instance.delete()


# --- Portfolio Snapshots ---
class PortfolioSnapshotListView(generics.ListAPIView):
    serializer_class = PortfolioSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioSnapshot.objects.filter(portfolio__user=self.request.user).order_by("-timestamp")


# --- Holdings ---
class HoldingListView(generics.ListAPIView):
    serializer_class = HoldingLotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Holding.objects.filter(portfolio__user=self.request.user)


class PortfolioAggregatedHoldingsView(generics.ListAPIView):
    serializer_class = AggregatedHoldingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        portfolio_id = self.kwargs["portfolio_id"]
        return (
            Holding.objects.filter(portfolio__id=portfolio_id, portfolio__user=self.request.user)
            .values(asset_symbol=F("asset__symbol"))
            .annotate(total_remaining_shares=Sum("remaining_shares"))
        )


# --- Transactions ---
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            portfolio__user=self.request.user,
            portfolio__id=self.kwargs["portfolio_id"]
        )

    def perform_create(self, serializer):
        portfolio = get_object_or_404(
            Portfolio,
            id=self.kwargs["portfolio_id"],
            user=self.request.user
        )
        data = serializer.validated_data
        # Ensure atomic operation
        with db_transaction.atomic():
            apply_transaction(
                portfolio=portfolio,
                asset=data["asset"],
                tx_type=data["transaction_type"],
                transaction_date=data["transaction_date"],
                shares=data["shares"],
                price=data["price"]
            )


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(portfolio__user=self.request.user)


# --- Stock Prices ---
class StockPriceListView(generics.ListAPIView):
    serializer_class = StockPriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        symbol = self.kwargs["symbol"]
        return StockPrice.objects.filter(symbol=symbol).order_by("-date")


# --- Users / Auth ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)