from django.shortcuts import render # type: ignore
from .models import Item
from django.http import JsonResponse # type: ignore

def get_items_api(request):
    items = Item.objects.all().values('name', 'date', 'created_at')
    return JsonResponse({'items': list(items)})
