from nicegui import ui # type: ignore

def content():
    with ui.footer(value=False) as footer:
        ui.label('Footer')

    with ui.page_sticky(position='bottom-right', x_offset=20, y_offset=20):
        ui.button(on_click=footer.toggle, icon='contact_support').props('fab')
