from django.urls import path
from api.views.user import RegisterView, UserDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # JWT login and refresh
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User registration
    path('register/', RegisterView.as_view(), name='register'),

    # Get current logged-in user
    path('user/', UserDetailView.as_view(), name='user_detail'),
]
