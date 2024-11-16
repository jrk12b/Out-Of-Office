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

with ui.tab_panels(tabs, value='2024').classes('w-full'):
    with ui.tab_panel('2024'):
        tab_content.current_year_content()
    with ui.tab_panel('2023'):
        tab_content.last_year_content()
    with ui.tab_panel('2022'):
        tab_content.previous_year_content()

ui.run()
