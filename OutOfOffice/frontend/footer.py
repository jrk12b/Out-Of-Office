from nicegui import ui # type: ignore

def create_footer():
    with ui.footer(value=False) as footer:
        ui.label('Footer')
    return footer
