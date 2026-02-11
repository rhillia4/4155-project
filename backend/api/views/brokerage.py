from rest_framework import generics, permissions
from ..models import (
    Portfolio,
    PortfolioSnapshot,
)
from ..serializers import (
    PortfolioSerializer,
    PortfolioSnapshotSerializer,
)


# TODO: add validation to ensure user can only have one portfolio per game if portfolio is for a game, also add option to create portfolio without game association for users who want to track real investments
class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionError("Not your portfolio")
        serializer.save()
        
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionError("Not your portfolio")
        instance.delete()

class PortfolioSnapshotListView(generics.ListAPIView):
    serializer_class = PortfolioSnapshotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioSnapshot.objects.filter(
            portfolio__user=self.request.user
        )