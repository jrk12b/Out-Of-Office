import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../Calendar.css';

const Calendar = ({ activeYear, ptoList }) => {
	const calendarRef = useRef(null);

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(`${activeYear}-01-01`);
		}
	}, [activeYear]);

	const calendarEvents = ptoList
		.filter((pto) => pto.date.startsWith(activeYear))
		.map((pto) => ({
			title: pto.name,
			date: pto.date,
			color: '#FF5733',
		}));

	return (
		<div className="calendar-container">
			<FullCalendar
				ref={calendarRef}
				plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
				initialView="multiMonthYear"
				multiMonthMaxColumns="1"
				initialDate={`${activeYear}-01-01`}
				editable={true}
				events={calendarEvents}
				timeZone="UTC"
				height="auto"
			/>
		</div>
	);
};

export default Calendar;
