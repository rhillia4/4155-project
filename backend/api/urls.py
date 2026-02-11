from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User registration
    path('register/', RegisterView.as_view(), name='register'),

    # Get current logged-in user
    path('user/', UserDetailView.as_view(), name='user_detail'),

    path("assets/", AssetListView.as_view()),
    path("portfolios/", PortfolioListCreateView.as_view()),
    path("portfolios/<int:pk>/", PortfolioDetailView.as_view()),
    path("portfolios/<int:portfolio_id>/transactions/", TransactionListCreateView.as_view()),
    path("transactions/<int:pk>/", TransactionCreateView.as_view()),
    path("stock-price/<str:symbol>/", StockPriceListView.as_view()),
]
