from nicegui import events, ui # type: ignore
from fullcalendar import FullCalendar as fullcalendar
from datetime import datetime
import requests # type: ignore
from django.middleware.csrf import get_token # type: ignore
import footer
from header_drawer import create_header_and_drawer
import tab_content
import get_items

ui.add_head_html("""
    <style>
    </style>
""")

header, tabs, left_drawer = create_header_and_drawer()

footer.content()

items = get_items.get_items()

with ui.tab_panels(tabs, value='2024').classes('w-full'):
    columns = [
        {'name': 'name', 'label': 'Name', 'field': 'name', 'align': 'left'},
        {'name': 'date', 'label': 'Date', 'field': 'date'},
    ]
    rows = [
        {'id': idx, 'name': item['name'], 'date': item['date']}
        for idx, item in enumerate(items)
    ]
    options = {
        'initialView': 'dayGridMonth',
        'headerToolbar': {'left': 'title', 'right': ''},
        'footerToolbar': {'right': 'prev,next today'},
        'slotMinTime': '05:00:00',
        'slotMaxTime': '22:00:00',
        'allDaySlot': False,
        'timeZone': 'local',
        'height': 'auto',
        'width': 'auto',
        'events': []  # Start with an empty list for events
    }
    # Populate the events from the items data
    for item in items:
        event = {
            'title': item['name'],
            'start': f"{item['date']} 08:00:00",
            'end': f"{item['date']} 10:00:00",
            'color': 'red',
        }
        options['events'].append(event)

    with ui.tab_panel('2024'):
        tab_content.current_year_content()
    with ui.tab_panel('2023'):
        tab_content.last_year_content()
    with ui.tab_panel('2022'):
        tab_content.previous_year_content()

ui.run()
