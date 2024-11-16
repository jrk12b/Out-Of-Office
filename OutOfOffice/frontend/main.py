from nicegui import events, ui # type: ignore
from django.middleware.csrf import get_token # type: ignore
from components import footer
from components.header_drawer import create_header_and_drawer
from components import tab_content

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
