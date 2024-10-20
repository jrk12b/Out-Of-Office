from nicegui import ui

@ui.page('/')
def hello_world():
    ui.label('Hello, World!')

ui.run()
