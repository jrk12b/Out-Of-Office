from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('items/', views.get_items_api, name='get_items'),
    path('items/add/', views.add_item_api, name='add_item_api'),
    path('items/<int:item_id>/update/', views.update_item_api, name='update_item_api'),  # URL to update an item
    path('items/<int:item_id>/delete/', views.delete_item_api, name='delete_item_api'),  # URL to delete an item
    path('get-csrf-token/', views.csrf_token_view, name='get_csrf_token'),
]
