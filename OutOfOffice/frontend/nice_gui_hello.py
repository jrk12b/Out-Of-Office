from nicegui import events, ui # type: ignore
from datetime import datetime
from fullcalendar import FullCalendar as fullcalendar
# dark = ui.dark_mode()
# dark.enable() 

with ui.header().classes(replace='row items-center') as header:
    ui.button(on_click=lambda: left_drawer.toggle(), icon='menu').props('flat color=white')
    with ui.tabs() as tabs:
        ui.tab('2024')
        ui.tab('2023')
        ui.tab('2022')

with ui.footer(value=False) as footer:
    ui.label('Footer')

with ui.left_drawer(value=False) as left_drawer:
    ui.label('Home')
    ui.label('Account')
    ui.label('Trips')
    ui.label('Budget')
    ui.label('Recommendations')
    ui.label('Destination Insights')

with ui.page_sticky(position='bottom-right', x_offset=20, y_offset=20):
    ui.button(on_click=footer.toggle, icon='contact_support').props('fab')

with ui.tab_panels(tabs, value='2024').classes('w-full'):        
    with ui.tab_panel('2024'):
        columns = [
            {'name': 'name', 'label': 'Name', 'field': 'name', 'align': 'left'},
            {'name': 'date', 'label': 'Date', 'field': 'date'},
            ]
        rows = [
            {'id': 0, 'name': 'Misc - in VA', 'date': '02/19/2024'},
            {'id': 1, 'name': 'Misc - in VA', 'date': '02/20/2024'},
            {'id': 2, 'name': 'Sarasota, FL with Ryan', 'date': '02/19/2024'},
            {'id': 3, 'name': 'Sarasota, FL with Ryan', 'date': 32},
            {'id': 4, 'name': 'Sarasota, FL with Ryan', 'date': 12},
            {'id': 5, 'name': 'Sarasota, FL with Ryan', 'date': 25},
            {'id': 6, 'name': 'New York', 'date': 25},
            {'id': 7, 'name': 'New York', 'date': 25},
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
                    'events': [
                        {
                            'title': 'Math',
                            'start': datetime.now().strftime(r'%Y-%m-%d') + ' 08:00:00',
                            'end': datetime.now().strftime(r'%Y-%m-%d') + ' 10:00:00',
                            'color': 'red',
                        },
                        {
                            'title': 'Physics',
                            'start': datetime.now().strftime(r'%Y-%m-%d') + ' 10:00:00',
                            'end': datetime.now().strftime(r'%Y-%m-%d') + ' 12:00:00',
                            'color': 'green',
                        },
                        {
                            'title': 'Chemistry',
                            'start': datetime.now().strftime(r'%Y-%m-%d') + ' 13:00:00',
                            'end': datetime.now().strftime(r'%Y-%m-%d') + ' 15:00:00',
                            'color': 'blue',
                        },
                        {
                            'title': 'Biology',
                            'start': datetime.now().strftime(r'%Y-%m-%d') + ' 15:00:00',
                            'end': datetime.now().strftime(r'%Y-%m-%d') + ' 17:00:00',
                            'color': 'orange',
                        },
                    ],
                }

        def handle_click(event: events.GenericEventArguments):
            if 'info' in event.args:
                ui.notify(event.args['info']['event'])
        def add_row() -> None:
            new_id = max((dx['id'] for dx in rows), default=-1) + 1
            rows.append({'id': new_id, 'name': 'New PTO', 'date': 21})
            ui.notify(f'Added new row with ID {new_id}')
            table.update()
            update_pto_planned()
        
        def update_pto_planned():
            row_count = len(rows)
            pto_planned_label.text = f'{row_count}'  # Update the text of the PTO Planned label
            update_pto_remaining()
        
        def update_pto_remaining():
            # Calculate remaining PTO and update the label
            pto_remaining_value = total_pto_value - int(pto_planned_label.text)  # Convert label text to int
            pto_remaining_label.text = f'{pto_remaining_value} Days'
        total_pto_value = 21

        def rename(e: events.GenericEventArguments) -> None:
            for row in rows:
                if row['id'] == e.args['id']:
                    row.update(e.args)
            ui.notify(f'Updated rows to: {table.rows}')
            table.update()

        def delete(e: events.GenericEventArguments) -> None:
            rows[:] = [row for row in rows if row['id'] != e.args['id']]
            ui.notify(f'Deleted row with ID {e.args["id"]}')
            table.update()
            
        with ui.column().classes('items-start'):
            # Top row with Table on the left and PTO Cards on the right, in a horizontal layout
            with ui.row().classes('justify-start items-start gap-4'):
                
                # Table on the left
                table = ui.table(columns=columns, rows=rows, row_key='name').classes('flex-grow')
                
                # PTO Cards section and calendar/label on the right
                with ui.column().classes('gap-4'):
                    # PTO Cards displayed horizontally
                    with ui.row().classes('gap-4'):
                        with ui.card():
                            ui.label('Total PTO').classes('text-h6 text-primary')
                            total_pto_label = ui.label(f'{total_pto_value} Days').classes('text-h6 text-primary')

                        with ui.card():
                            ui.label('PTO Planned').classes('text-h6 text-primary')
                            pto_planned_label = ui.label(f'{len(rows)} Days').classes('text-h6 text-primary')

                        with ui.card():
                            ui.label('PTO Remaining').classes('text-h6 text-primary')
                            pto_remaining_label = ui.label(f'{total_pto_value - len(rows)} Days').classes('text-h6 text-primary')

                    # Calendar and additional label below the PTO cards but next to the table
                    with ui.column().classes('gap-2'):
                        fullcalendar(options, on_click=handle_click).classes('ml-10 mt-5').style('min-width: 400px; max-width: 800px; height: 500px;')
# .classes('mt-4 ml-2')

        update_pto_planned()
        update_pto_remaining()

        table.add_slot('header', r'''
            <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                </q-th>
            </q-tr>
        ''')
        table.add_slot('body', r'''
            <q-tr :props="props">
                <q-td auto-width >
                    <q-btn size="sm" color="warning" round dense icon="delete"
                        @click="() => $parent.$emit('delete', props.row)"
                    />
                </q-td>
                <q-td key="name" :props="props">
                    {{ props.row.name }}
                    <q-popup-edit v-model="props.row.name" v-slot="scope"
                        @update:model-value="() => $parent.$emit('rename', props.row)"
                    >
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
                <q-td key="date" :props="props">
                    {{ props.row.date }}
                    <q-popup-edit v-model="props.row.date" v-slot="scope"
                        @update:model-value="() => $parent.$emit('rename', props.row)"
                    >
                        <q-input v-model="scope.value" type="date" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                </q-td>
            </q-tr>
        ''')
        with table.add_slot('bottom-row'):
            with table.cell().props('colspan=3'):
                ui.button('Add row', icon='add', color='primary', on_click=add_row).classes('w-full')
        table.on('rename', rename)
        table.on('delete', delete)
    with ui.tab_panel('2023'):
        ui.label('Content of 2023')
    with ui.tab_panel('2022'):
        ui.label('Content of 2022')

ui.run()
