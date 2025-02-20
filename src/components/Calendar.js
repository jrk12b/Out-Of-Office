import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../Calendar.css';

// Calendar component accepts 'activeYear' and 'ptoList' as props
const Calendar = ({ activeYear, ptoList }) => {
	const calendarRef = useRef(null);
	// State to manage the number of columns in the multi-month view
	const [multiMonthColumns, setMultiMonthColumns] = useState(1);
	// State to manage the tooltip content (for event details)
	const [tooltip, setTooltip] = useState(null);

	// useEffect hook to go to the first day of the active year on initial load
	useEffect(() => {
		// Ensure FullCalendar is accessible via ref and set the date to the start of the active year
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(`${activeYear}-01-01`);
		}
	}, [activeYear]); // Only runs when the 'activeYear' prop changes

	// Map through the PTO list and create events for FullCalendar
	const calendarEvents = ptoList.map((pto) => ({
		title: pto.name, // Event title (PTO name)
		date: pto.date, // Event date (PTO date)
		color: pto.color || '#FF5733', // PTO event color (default is red if not specified)
	}));

	// Function to handle changes in the number of columns displayed in the multi-month view
	const handleColumnsChange = (columns) => {
		setMultiMonthColumns(columns); // Update the number of columns in the multi-month view
	};

	// Function to handle event clicks and show the event tooltip
	const handleEventClick = (info) => {
		// Get the position of the event on the screen
		const rect = info.el.getBoundingClientRect();

		// Toggle the tooltip visibility (show or hide based on whether it was clicked before)
		setTooltip((prevTooltip) =>
			prevTooltip && prevTooltip.title === info.event.title
				? null // If the same event was clicked, hide the tooltip
				: {
						// Show a new tooltip with event details
						title: info.event.title, // Event title
						date: info.event.date, // Event date
						x: rect.left + window.scrollX + rect.width / 2, // Horizontal position of tooltip
						y: rect.top + window.scrollY - 30, // Vertical position of tooltip
					}
		);
	};

	return (
		<div className="calendar-container">
			{/* Button container to change the number of columns in the multi-month view */}
			<div className="button-container">
				<button onClick={() => handleColumnsChange(1)}>1 Column</button>{' '}
				{/* Button to show 1 column */}
				<button onClick={() => handleColumnsChange(2)}>2 Columns</button>{' '}
				{/* Button to show 2 columns */}
				<button onClick={() => handleColumnsChange(3)}>3 Columns</button>{' '}
				{/* Button to show 3 columns */}
			</div>
			{/* FullCalendar component displaying events */}
			<FullCalendar
				ref={calendarRef} // Reference to access FullCalendar API
				plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]} // Plugins used for multi-month, day grid, and interaction
				initialView="multiMonthYear" // Default view is multi-month year view
				multiMonthMaxColumns={multiMonthColumns} // Set number of columns dynamically based on state
				initialDate={`${activeYear}-01-01`} // Set the initial date to the start of the active year
				editable={true} // Allow editing of events (drag, resize, etc.)
				events={calendarEvents} // Pass the list of events to FullCalendar
				timeZone="UTC" // Set the timezone to UTC
				height="auto" // Auto height adjustment for the calendar
				eventClick={handleEventClick} // Attach the eventClick handler for displaying event details
			/>
			{/* Conditional rendering of tooltip */}
			{tooltip && (
				<div
					style={{
						position: 'absolute', // Absolute positioning for tooltip
						top: tooltip.y, // Vertical position of the tooltip
						left: tooltip.x, // Horizontal position of the tooltip
						background: '#333', // Dark background for the tooltip
						color: '#fff', // White text color
						padding: '5px 10px', // Padding inside the tooltip
						borderRadius: '5px', // Rounded corners for the tooltip
						zIndex: 1000, // Ensure the tooltip is on top of other elements
						transform: 'translateX(-50%)', // Center the tooltip horizontally
					}}
				>
					{tooltip.title} {/* Display the event title in the tooltip */}
				</div>
			)}
		</div>
	);
};

export default Calendar;
