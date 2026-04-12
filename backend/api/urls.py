from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from .budget_views import BudgetProfileView, BudgetTransactionListCreateView, BudgetTransactionDetailView

urlpatterns = [
    # --- Auth ---
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),

    # --- Assets ---
    path('assets/', AssetListView.as_view(), name='asset-list'),
    path('assets/<int:id>/', AssetDetailView.as_view(), name='asset-detail'),

    # --- Portfolios ---
    path('portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),

    # --- Holdings ---
    path('portfolios/<int:portfolio_id>/holdings/', HoldingListView.as_view(), name='portfolio-holdings'),
    path('portfolios/<int:portfolio_id>/holdings/aggregated/', PortfolioAggregatedHoldingsView.as_view(), name='portfolio-holdings-aggregated'),

    # --- Transactions ---
    path('portfolios/<int:portfolio_id>/transactions/', TransactionListCreateView.as_view(), name='portfolio-transactions'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),

    # --- Portfolio Snapshots ---
    path('portfolios/<int:portfolio_id>/snapshots/', PortfolioSnapshotListView.as_view(), name='portfolio-snapshots'),

    # --- Stock Prices ---
    path('stock-price/<str:symbol>/', StockPriceListView.as_view(), name='stock-price-list'),

    # --- Budget ---
    path('budget/profile/', BudgetProfileView.as_view(), name='budget-profile'),
    path('budget/transactions/', BudgetTransactionListCreateView.as_view(), name='budget-transaction-list-create'),
    path('budget/transactions/<int:pk>/', BudgetTransactionDetailView.as_view(), name='budget-transaction-detail'),
]