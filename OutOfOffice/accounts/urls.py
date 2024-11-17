from django.urls import path # type: ignore
from . import views
from .views import is_authenticated

urlpatterns = [
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.user_register, name='register'),
    path('is-authenticated/', is_authenticated, name='is_authenticated'),
]
