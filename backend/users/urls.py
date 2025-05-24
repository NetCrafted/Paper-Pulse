from django.urls import path
from .views import ChangePasswordView, CustomTokenObtainPairView, DeleteAccountView, RegisterView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair')
  
]