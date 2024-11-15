from nicegui import ui

def create_header_and_drawer():
    # Create header with menu button and tabs
    with ui.header().classes(replace='row items-center') as header:
        ui.button(on_click=lambda: left_drawer.toggle(), icon='menu').props('flat color=white')
        with ui.tabs() as tabs:
            ui.tab('2024')
            ui.tab('2023')
            ui.tab('2022')

    # Create left drawer with navigation labels
    with ui.left_drawer(value=False) as left_drawer:
        ui.label('Home')
        ui.label('Account')
        ui.label('Trips')
        ui.label('Budget')
        ui.label('Recommendations')
        ui.label('Destination Insights')

    # Return header, tabs, and drawer for use in main code
    return header, tabs, left_drawer
