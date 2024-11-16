from nicegui import events, ui # type: ignore
import requests # type: ignore
from datetime import datetime
from components.fullcalendar import FullCalendar as fullcalendar
from components import get_items

def last_year_content() -> None:
    ui.label('2023 content')

def previous_year_content() -> None:
    ui.label('2022 content')

def current_year_content() -> None:
    items = get_items.get_items()
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
            'start': f"{item['date']} 08:00:00",  # Adjust time as needed
            'end': f"{item['date']} 10:00:00",    # End time example, adjust as needed
            'color': 'red',  # Customize color if needed
        }
        options['events'].append(event)
    def handle_click(event: events.GenericEventArguments):
            if 'info' in event.args:
                ui.notify(event.args['info']['event'])
    def add_row() -> None:
        with requests.Session() as session:
            csrf_response = session.get('http://127.0.0.1:8000/database/get-csrf-token/')
            csrf_token = csrf_response.json().get('csrfToken')
            new_id = max((dx['id'] for dx in rows), default=-1) + 1
            new_row = {'id': new_id, 'name': 'New PTO', 'date': '2024-11-21'}  # example date format
            headers = {
                'X-CSRFToken': csrf_token,  # Use the CSRF token in headers
                'Content-Type': 'application/json'
                }

            try:
                # Send POST request to add the new row to the database
                response = session.post('http://127.0.0.1:8000/database/items/add/', json=new_row, headers=headers)
                
                # Check if the request was successful
                if response.status_code == 201:  # assuming 201 Created is returned for success
                    # Get the row data (including DB-generated ID if applicable)
                    db_row = response.json()  # Assume the response contains the created row with 'id'
                    new_row['id'] = db_row.get('id', new_id)  # Update with DB ID if available

                    # Add row to table
                    rows.append(new_row)
                    ui.notify(f'Added new row with ID {new_row["id"]}')
                    # Add event to calendar
                    calendar_event = {
                        'title': new_row['name'],
                        'start': f"{new_row['date']} 08:00:00",  # Adjust start time
                        'end': f"{new_row['date']} 17:00:00",    # Adjust end time
                    }
                    calendar.add_event(**calendar_event)  # Add to the FullCalendar
                    table.update()
                    update_pto_planned()
                else:
                    ui.notify(f"Failed to add row to the database: {response.text}", color="red")

            except requests.exceptions.RequestException as e:
                ui.notify(f"Error adding row to database: {str(e)}", color="red")
        
    def update_pto_planned():
        row_count = len(rows)
        pto_planned_label.text = f'{row_count}'  # Update the text of the PTO Planned label
        update_pto_remaining()
    
    def update_pto_remaining():
        # Calculate remaining PTO and update the label
        pto_remaining_value = total_pto_value - int(pto_planned_label.text)  # Convert label text to int
        pto_remaining_label.text = f'{pto_remaining_value} Days'
    total_pto_value = 31

    def rename(e: events.GenericEventArguments) -> None:
        # Get the updated values from the event arguments
        updated_row = e.args
        row_id = updated_row['id']
        
        # Find the row in the frontend table
        for row in rows:
            if row['id'] == row_id:
                row.update(updated_row)  # Update the row in the frontend table
        
        # Prepare the data to be sent to the backend for updating the database
        data = {
            'name': updated_row['name'],
            'date': updated_row['date']
        }
        with requests.Session() as session:
            # Get the CSRF token for making a POST request
            csrf_response = session.get('http://127.0.0.1:8000/database/get-csrf-token/')
            csrf_token = csrf_response.json().get('csrfToken')

            # Set up the headers with CSRF token
            headers = {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            }

            # Send a PATCH request to update the item in the database
            try:
                response = session.patch(f'http://127.0.0.1:8000/database/items/{row_id}/update/', json=data, headers=headers)
                if response.status_code == 200:
                    # If update was successful, update the frontend table
                    updated_item = response.json()
                    ui.notify(f'Updated item with ID {updated_item["id"]}')
                    table.update()
                else:
                    ui.notify(f"Failed to update item: {response.text}", color="red")
            except requests.exceptions.RequestException as e:
                ui.notify(f"Error updating item: {str(e)}", color="red")


    def delete(e: events.GenericEventArguments) -> None:
        row_id = e.args['id']
        print(f'e: {e}')
        print(f'row_id: {row_id}')

        # Find the row to delete
        row_to_delete = next((row for row in rows if row['id'] == row_id), None)
        if not row_to_delete:
            ui.notify("Row not found", color="red")
            return

        # Remove the row from the frontend table (rows list)
        rows[:] = [row for row in rows if row['id'] != row_id]

        calendar_event = {
            'title': row_to_delete['name'],
            'start': f"{row_to_delete['date']} 08:00:00",
            'end': f"{row_to_delete['date']} 17:00:00",
        }
        calendar.remove_event(**calendar_event)

        with requests.Session() as session:
            # Prepare headers with CSRF token
            csrf_response = session.get('http://127.0.0.1:8000/database/get-csrf-token/')
            csrf_token = csrf_response.json().get('csrfToken')
            headers = {
                'X-CSRFToken': csrf_token,
                'Content-Type': 'application/json'
            }

            # Send a DELETE request to the backend to remove the item from the database
            try:
                response = session.delete(f'http://127.0.0.1:8000/database/items/{row_id}/delete/', headers=headers)

                if response.status_code == 200:
                    ui.notify(f'Deleted row and event with ID {row_id}')
                    table.update()
                    update_pto_planned()
                else:
                    ui.notify(f"Failed to delete item: {response.text}", color="red")
            except requests.exceptions.RequestException as exc:
                ui.notify(f"Error deleting item: {str(exc)}", color="red")
        
    with ui.column().classes('items-start'):
        # Top row with Table on the left and PTO Cards on the right, in a horizontal layout
        with ui.row().classes('justify-start items-start gap-4'):
            
            # Table on the left
            rows = sorted(rows, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'), reverse=True)
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
                    calendar = fullcalendar(options, on_click=handle_click).classes('ml-10 mt-5').style('min-width: 400px; max-width: 800px; height: 500px;')

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