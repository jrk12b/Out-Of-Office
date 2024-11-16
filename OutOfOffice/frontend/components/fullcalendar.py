from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

from nicegui.element import Element # type: ignore
from nicegui.events import handle_event # type: ignore


class FullCalendar(Element, component='fullcalendar.js'):

    def __init__(self, options: Dict[str, Any], on_click: Optional[Callable] = None) -> None:
        """FullCalendar

        An element that integrates the FullCalendar library (https://fullcalendar.io/) to create an interactive calendar display.
        For an example of the FullCalendar library with plugins see https://github.com/dorel14/NiceGui-FullCalendar_more_Options

        :param options: dictionary of FullCalendar properties for customization, such as "initialView", "slotMinTime", "slotMaxTime", "allDaySlot", "timeZone", "height", and "events".
        :param on_click: callback that is called when a calendar event is clicked.
        """
        super().__init__()
        self.add_resource(Path(__file__).parent / 'lib')
        self._props['options'] = options

        if on_click:
            self.on('click', lambda e: handle_event(on_click, e))

    def add_event(self, title: str, start: str, end: str, **kwargs) -> None:
        """Add an event to the calendar.

        :param title: title of the event
        :param start: start time of the event
        :param end: end time of the event
        """
        event_dict = {'title': title, 'start': start, 'end': end, **kwargs}
        self._props['options']['events'].append(event_dict)
        self.update()
        self.run_method('update_calendar')

    def remove_event(self, title: str, start: str, end: str) -> None:
        """Remove an event from the calendar.

        :param title: title of the event
        :param start: start time of the event
        :param end: end time of the event
        """
        for event in self._props['options']['events']:
            if event['title'] == title and event['start'] == start and event['end'] == end:
                self._props['options']['events'].remove(event)
                break

        self.update()
        self.run_method('update_calendar')

    def update_event(self, old_title: str, new_title: Optional[str] = None, new_start: Optional[str] = None, new_end: Optional[str] = None) -> None:
        """Update an existing event in the calendar.

        :param old_title: Title of the existing event to update.
        :param new_title: New title for the event (optional).
        :param new_start: New start time for the event (optional).
        :param new_end: New end time for the event (optional).
        """
        for event in self._props['options']['events']:
            if event['title'] == old_title:
                if new_title:
                    event['title'] = new_title
                if new_start:
                    event['start'] = new_start
                if new_end:
                    event['end'] = new_end
                break

        self.update()
        self.run_method('update_calendar')

    @property
    def events(self) -> List[Dict]:
        """List of events currently displayed in the calendar."""
        return self._props['options']['events']