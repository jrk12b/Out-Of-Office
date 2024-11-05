#!/usr/bin/env python3
from nicegui import events, ui

with ui.header().classes(replace='row items-center') as header:
    ui.button(on_click=lambda: left_drawer.toggle(), icon='menu').props('flat color=white')
    with ui.tabs() as tabs:
        ui.tab('A')
        ui.tab('B')
        ui.tab('C')

with ui.footer(value=False) as footer:
    ui.label('Footer')

with ui.left_drawer().classes('bg-blue-100') as left_drawer:
    ui.label('Side menu')

with ui.page_sticky(position='bottom-right', x_offset=20, y_offset=20):
    ui.button(on_click=footer.toggle, icon='contact_support').props('fab')

with ui.tab_panels(tabs, value='A').classes('w-full'):        
    with ui.tab_panel('A'):
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
            {'id': 8, 'name': 'Camping with Family', 'date': 25},
            {'id': 9, 'name': 'Boston NBA Finals', 'date': 25},
            {'id': 10, 'name': 'Boston NBA Finals', 'date': 25},
            {'id': 11, 'name': 'Boston NBA Finals', 'date': 25},
            {'id': 12, 'name': 'Boston NBA Finals', 'date': 25},
            {'id': 13, 'name': 'Colorado with Scott', 'date': 25},
            {'id': 14, 'name': 'Colorado with Scott', 'date': 25},
            {'id': 15, 'name': 'Colorado with Scott', 'date': 25},
            {'id': 16, 'name': 'Colorado with Scott', 'date': 25},
            {'id': 17, 'name': 'Colorado with Scott', 'date': 25},
            {'id': 18, 'name': 'DC with Hannah', 'date': 25},
            {'id': 19, 'name': 'DC with Hannah', 'date': 25},
            {'id': 20, 'name': 'DC with Hannah', 'date': 25},
            {'id': 21, 'name': 'Iceland', 'date': 25},
            {'id': 22, 'name': 'Iceland', 'date': 25},
            {'id': 23, 'name': 'Iceland', 'date': 25},
            {'id': 24, 'name': 'Iceland', 'date': 25},
            {'id': 25, 'name': 'Iceland', 'date': 25},
            {'id': 26, 'name': 'Iceland', 'date': 25},
            {'id': 27, 'name': 'Iceland', 'date': 25},
            {'id': 28, 'name': 'Kevin Wedding', 'date': 25},
        ]
        def add_row() -> None:
            new_id = max((dx['id'] for dx in rows), default=-1) + 1
            rows.append({'id': new_id, 'name': 'New PTO', 'date': 21})
            ui.notify(f'Added new row with ID {new_id}')
            table.update()


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

        table = ui.table(columns=columns, rows=rows, row_key='name').classes('')
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
                ui.button('Add row', icon='add', color='accent', on_click=add_row).classes('w-full')
        table.on('rename', rename)
        table.on('delete', delete)
    with ui.tab_panel('B'):
        ui.label('Content of B')
    with ui.tab_panel('C'):
        ui.label('Content of C')

ui.run()
