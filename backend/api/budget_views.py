from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BudgetProfile, BudgetTransaction
from .serializers import BudgetProfileSerializer, BudgetTransactionSerializer


class BudgetProfileView(APIView):
    """
    GET  /budget/profile/  — returns the user's budget profile (creates one if none exists)
    PUT  /budget/profile/  — update monthly income and category limits
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = BudgetProfile.objects.get_or_create(user=request.user)
        serializer = BudgetProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = BudgetProfile.objects.get_or_create(user=request.user)
        serializer = BudgetProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetTransactionListCreateView(generics.ListCreateAPIView):
    """
    GET  /budget/transactions/  — list all transactions for the logged-in user
    POST /budget/transactions/  — create a new transaction
    """
    serializer_class = BudgetTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetTransaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetTransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /budget/transactions/<id>/  — retrieve a single transaction
    PUT    /budget/transactions/<id>/  — update a transaction
    DELETE /budget/transactions/<id>/  — delete a transaction
    """
    serializer_class = BudgetTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetTransaction.objects.filter(user=self.request.user)