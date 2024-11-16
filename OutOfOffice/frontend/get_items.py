from nicegui import ui # type: ignore
import requests # type: ignore

def get_items():
    response = requests.get('http://127.0.0.1:8000/database/items/')
    items = response.json().get('items', [])

    return items
