import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../Calendar.css';

const Calendar = ({ activeYear, ptoList }) => {
	const calendarRef = useRef(null);
	const [multiMonthColumns, setMultiMonthColumns] = useState(1); // State to control multiMonthMaxColumns

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

	const handleColumnsChange = (columns) => {
		setMultiMonthColumns(columns);
	};

	return (
		<div className="calendar-container">
			<div className="button-container">
				<button onClick={() => handleColumnsChange(1)}>1 Column</button>
				<button onClick={() => handleColumnsChange(2)}>2 Columns</button>
				<button onClick={() => handleColumnsChange(3)}>3 Columns</button>
			</div>
			<FullCalendar
				ref={calendarRef}
				plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
				initialView="multiMonthYear"
				multiMonthMaxColumns={multiMonthColumns}
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
