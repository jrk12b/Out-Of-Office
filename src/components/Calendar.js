import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../Calendar.css';

const Calendar = ({ activeYear, ptoList }) => {
	const calendarRef = useRef(null);
	const [multiMonthColumns, setMultiMonthColumns] = useState(1);
	const [tooltip, setTooltip] = useState(null);

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

	const handleEventClick = (info) => {
		const rect = info.el.getBoundingClientRect();

		setTooltip((prevTooltip) =>
			prevTooltip && prevTooltip.title === info.event.title
				? null
				: {
						title: info.event.title,
						date: info.event.date,
						x: rect.left + window.scrollX + rect.width / 2,
						y: rect.top + window.scrollY - 30,
					}
		);
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
				eventClick={handleEventClick} // <-- Click event instead of hover
			/>
			{tooltip && (
				<div
					style={{
						position: 'absolute',
						top: tooltip.y,
						left: tooltip.x,
						background: '#333',
						color: '#fff',
						padding: '5px 10px',
						borderRadius: '5px',
						zIndex: 1000,
						transform: 'translateX(-50%)',
					}}
				>
					{tooltip.title}
				</div>
			)}
		</div>
	);
};

export default Calendar;
