import React, { useState, useEffect } from 'react';
import PTOPlannedCard from './PTOPlannedCard';
import TotalPTOCard from './PTOTotalCard';
import PTORemainingCard from './PTORemainingCard';
import PTOCard from './PTOCard';
import axios from 'axios';

const { HOST } = require('../config.js');

const PageContent = ({ activeYear, ptoList, addPTO, deletePTO }) => {
	const [totalPTOByYear, setTotalPTOByYear] = useState({});

	useEffect(() => {
		const fetchTotalPTO = async () => {
			try {
				const response = await axios.get(`${HOST}/api/pto/pto-total/${activeYear}`, {
					withCredentials: true,
				});

				// Update the total PTO for the active year in the state
				setTotalPTOByYear((prev) => ({
					...prev,
					[activeYear]: response.data.totalPTO, // Assuming response.data contains the PTO data
				}));
			} catch (error) {
				console.error('Error fetching total PTO:', error);
			}
		};

		if (activeYear) {
			fetchTotalPTO(); // Fetch total PTO data when activeYear changes
		}
	}, [activeYear]); // Re-run the effect if activeYear changes

	// Update the total PTO for a specific year
	const updateTotalPTO = (activeYear, value) => {
		setTotalPTOByYear((prev) => ({
			...prev,
			[activeYear]: value,
		}));
	};

	// Update an existing PTO entry
	const updatePTO = async (id, updatedPTO) => {
		try {
			const response = await fetch(`${HOST}/api/pto/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedPTO),
			});

			if (response.ok) {
				const updatedList = ptoList.map((pto) =>
					pto._id === id ? { ...pto, ...updatedPTO } : pto
				);

				// Update the PTO list with the new data
				setTotalPTOByYear(updatedList);
			} else {
				console.error('Failed to update PTO');
			}
		} catch (error) {
			console.error('Error updating PTO:', error);
		}
	};

	// Filter PTO list for the active year
	const filteredPTOList = ptoList.filter((pto) => pto.pto_year === activeYear);

	const totalPTO = totalPTOByYear[activeYear] || 0;
	const ptoPlanned = filteredPTOList.length;
	const ptoRemaining = totalPTO - ptoPlanned;

	return (
		<main style={{ padding: '20px' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					marginBottom: '20px',
				}}
			>
				<TotalPTOCard
					activeYear={activeYear}
					totalPTO={totalPTO}
					updateTotalPTO={(value) => updateTotalPTO(activeYear, value)}
				/>
				<PTOPlannedCard ptoCount={ptoPlanned} />
				<PTORemainingCard ptoRemaining={ptoRemaining} />
			</div>
			<PTOCard
				ptoList={filteredPTOList}
				addPTO={addPTO}
				deletePTO={deletePTO}
				updatePTO={updatePTO}
			/>
		</main>
	);
};

export default PageContent;
