from django.shortcuts import render # type: ignore
from .models import Item
from django.http import JsonResponse # type: ignore
from django.middleware.csrf import get_token # type: ignore
import json

def get_items_api(request):
    items = Item.objects.all().values('name', 'date', 'created_at')
    return JsonResponse({'items': list(items)})

def csrf_token_view(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

def add_item_api(request):
    if request.method == 'POST':
        # Parse the request body as JSON
        data = json.loads(request.body)
        
        # Get data from the POST request
        name = data.get('name')
        date = data.get('date')

        # Create a new Item in the database
        new_item = Item.objects.create(name=name, date=date)

        # Return a JSON response with the created item's details and a 201 status
        return JsonResponse({
            'id': new_item.id,
            'name': new_item.name,
            'date': new_item.date,
            'created_at': new_item.created_at
        }, status=201)  # HTTP 201 Created

    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)  # Method Not Allowed
    
def update_item_api(request, item_id):
    if request.method == 'PATCH':  # You could also use PUT if you want to replace the entire object
        data = json.loads(request.body)

        # Try to get the item by ID
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item not found'}, status=404)

        # Update fields (here, just 'name' and 'date')
        item.name = data.get('name', item.name)
        item.date = data.get('date', item.date)
        item.save()

        # Return the updated item
        return JsonResponse({
            'id': item.id,
            'name': item.name,
            'date': item.date,
            'created_at': item.created_at
        })

    else:
        return JsonResponse({'error': 'Only PATCH method is allowed'}, status=405)  # Method Not Allowed
    
def delete_item_api(request, item_id):
    if request.method == 'DELETE':  # Ensure we are handling DELETE requests
        try:
            # Attempt to delete the item by its ID
            item = Item.objects.get(id=item_id)
            item.delete()
            return JsonResponse({'message': f'Item with ID {item_id} deleted successfully.'}, status=200)
        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item not found'}, status=404)  # Not Found if item doesn't exist
    else:
        return JsonResponse({'error': 'Only DELETE method is allowed'}, status=405)  # Method Not Allowed