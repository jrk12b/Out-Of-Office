from nicegui import events, ui # type: ignore
from django.middleware.csrf import get_token # type: ignore
from components import footer
from components.header_drawer import create_header_and_drawer
from components import tab_content

ui.add_head_html("""
    <style>
        /* Remove padding from the page container when the drawer is open */
        .q-page-container {
            transition: padding-left 0.3s ease; /* Optional: Add a transition effect */
        }

        .q-page-container.left-drawer-open {
            padding-left: 0 !important; /* Remove the 300px padding when the drawer is open */
        }

        /* Ensure no padding is applied when the drawer is closed */
        .q-page-container:not(.left-drawer-open) {
            padding-left: 0 !important;
        }
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
