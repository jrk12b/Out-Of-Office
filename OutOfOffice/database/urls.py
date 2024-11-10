# OutOfOffice/database/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.get_items_api, name='get_items'),
]
