from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from ..models import (
    Asset,
    Holding,
    Transaction,
    StockPrice,
    Portfolio
)
from ..serializers import (
    AssetSerializer,
    HoldingSerializer,
    TransactionSerializer,
    StockPriceSerializer
)


class AssetListView(generics.ListAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]


class HoldingListView(generics.ListAPIView):
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Holding.objects.filter(portfolio__user=self.request.user)
    
class HoldingCreateView(generics.CreateAPIView):
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        portfolio = serializer.validated_data["portfolio"]

        if portfolio.user != self.request.user:
            raise PermissionError("Not your portfolio")
        serializer.save()



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
        serializer.save(portfolio=portfolio)
class TransactionCreateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(
            portfolio__user=self.request.user
        )

    def perform_update(self, serializer):
        if serializer.instance.portfolio.user != self.request.user:
            raise PermissionDenied("Not your portfolio")
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.portfolio.user != self.request.user:
            raise PermissionDenied("Not your portfolio")
        instance.delete()

    
class StockPriceListView(generics.ListAPIView):
    serializer_class = StockPriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        symbol = self.kwargs["symbol"].upper()
        return StockPrice.objects.filter(symbol=symbol).order_by("-date")
