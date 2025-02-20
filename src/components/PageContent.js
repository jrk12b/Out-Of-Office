import React, { useState, useEffect } from 'react';
import PTOPlannedCard from './PTOPlannedCard';
import TotalPTOCard from './PTOTotalCard';
import PTORemainingCard from './PTORemainingCard';
import PTOCard from './PTOCard';
import axios from 'axios';

const { HOST } = require('../config.js'); // Import the host URL from the config file

const PageContent = ({ activeYear, ptoList, addPTO, deletePTO, setPtoList }) => {
	// State to store the total PTO for each year
	const [totalPTOByYear, setTotalPTOByYear] = useState({});

	// Fetch total PTO when the activeYear changes
	useEffect(() => {
		const fetchTotalPTO = async () => {
			try {
				// Make API request to get the total PTO for the given year
				const response = await axios.get(`${HOST}/api/pto/pto-total/${activeYear}`, {
					withCredentials: true, // Send cookies with the request for authentication
				});

				// Update the total PTO for the active year in the state
				setTotalPTOByYear((prev) => ({
					...prev,
					[activeYear]: response.data.totalPTO, // Set total PTO for the current year
				}));
			} catch (error) {
				console.error('Error fetching total PTO:', error); // Log any error during the fetch
			}
		};

		// Trigger the PTO fetching if the activeYear is defined
		if (activeYear) {
			fetchTotalPTO(); // Call the function to fetch the total PTO
		}
	}, [activeYear]); // Re-run the effect whenever activeYear changes

	// Update the total PTO for a specific year in the state
	const updateTotalPTO = (activeYear, value) => {
		setTotalPTOByYear((prev) => ({
			...prev,
			[activeYear]: value, // Set new total PTO for the given year
		}));
	};

	// Update an existing PTO entry in the backend and update the state
	const updatePTO = async (id, updatedPTO) => {
		try {
			// Define the URL for updating the PTO entry
			const url = `${HOST}/api/pto/${id}`;
			const body = JSON.stringify(updatedPTO); // Convert the updated PTO data to JSON
			const response = await fetch(url, {
				method: 'PUT', // HTTP method to update the entry
				headers: { 'Content-Type': 'application/json' },
				body: body, // Pass the updated PTO data in the request body
			});

			if (response.ok) {
				// If successful, update the PTO list in App.js and trigger re-render in Calendar
				const updatedList = ptoList.map(
					(pto) => (pto._id === id ? { ...pto, ...updatedPTO } : pto) // Update the specific PTO entry
				);

				// Update the state in the parent component
				setPtoList(updatedList);
			} else {
				console.error('Failed to update PTO'); // Log error if update fails
			}
		} catch (error) {
			console.error('Error updating PTO:', error); // Log any error during the update
		}
	};

	// Filter PTO list to only include entries for the active year
	const filteredPTOList = ptoList.filter((pto) => pto.pto_year === activeYear);

	// Calculate total PTO, planned PTO count, and remaining PTO
	const totalPTO = totalPTOByYear[activeYear] || 0; // Use 0 as default if no PTO is found for the year
	const ptoPlanned = filteredPTOList.length; // Number of planned PTO entries for the year
	const ptoRemaining = totalPTO - ptoPlanned; // Calculate remaining PTO

	return (
		<main style={{ padding: '20px' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					marginBottom: '20px',
				}}
			>
				{/* Total PTO card component */}
				<TotalPTOCard
					activeYear={activeYear}
					totalPTO={totalPTO}
					updateTotalPTO={(value) => updateTotalPTO(activeYear, value)} // Pass update function to child component
				/>
				{/* Planned PTO card component */}
				<PTOPlannedCard ptoCount={ptoPlanned} />
				{/* Remaining PTO card component */}
				<PTORemainingCard ptoRemaining={ptoRemaining} />
			</div>
			{/* PTO Card component to manage individual PTO entries */}
			<PTOCard
				ptoList={filteredPTOList}
				addPTO={addPTO}
				deletePTO={deletePTO}
				updatePTO={updatePTO} // Pass the updatePTO function for updating PTO
			/>
		</main>
	);
};

export default PageContent;
