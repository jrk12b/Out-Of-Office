import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const { HOST } = require('../../config.js'); // Get the host URL from the configuration

const TotalPTOCard = ({ activeYear }) => {
	// State hooks to manage total PTO and editing state
	const [isEditing, setIsEditing] = useState(false); // Tracks whether the component is in editing mode
	const [totalPTO, setTotalPTO] = useState(0); // Holds the total PTO for the current year
	const [newTotalPTO, setNewTotalPTO] = useState(0); // Holds the updated PTO value when editing

	// useEffect hook to fetch the total PTO for the active year when the component mounts or activeYear changes
	useEffect(() => {
		const fetchTotalPTO = async () => {
			if (!activeYear) return; // If no active year is provided, do not fetch data
			try {
				// Fetch the total PTO from the server for the active year
				const response = await axios.get(`${HOST}/api/pto/pto-total/${activeYear}`, {
					withCredentials: true,
				});
				const fetchedTotalPTO = response.data.totalPTO || 0; // Default to 0 if no data is returned
				setTotalPTO(fetchedTotalPTO); // Set the fetched total PTO
				setNewTotalPTO(fetchedTotalPTO); // Set the new total PTO for editing
			} catch (error) {
				console.error('Error fetching total PTO:', error); // Log errors if the fetch fails
			}
		};

		fetchTotalPTO(); // Call the fetch function when the component mounts or activeYear changes
	}, [activeYear]); // Only re-run the effect if activeYear changes

	// Function to update the total PTO on the server
	const updateTotalPTO = async (updatedTotal) => {
		if (!activeYear) {
			console.error('Year is required to update PTO total.'); // Log error if activeYear is not provided
			return;
		}

		try {
			// Send the updated PTO value to the server for the given year
			const response = await axios.post(
				`${HOST}/api/pto/pto-total`,
				{
					activeYear,
					totalPTO: updatedTotal,
				},
				{ withCredentials: true }
			);
			setTotalPTO(response.data.totalPTO); // Update the total PTO state with the new value from the server
		} catch (error) {
			console.error('Error updating total PTO:', error); // Log errors if the update fails
		}
	};

	// Handle the save action after editing the total PTO
	const handleSave = () => {
		updateTotalPTO(newTotalPTO); // Call the update function with the new total PTO
		setIsEditing(false); // Exit the editing mode
	};

	return (
		<Card className="total-pto-card">
			<Card.Header as="h5" className="card-header">
				Total PTO for {activeYear} {/* Display the year for which PTO is being managed */}
			</Card.Header>
			<Card.Body>
				{/* Conditionally render the display or editing mode */}
				{!isEditing ? (
					<>
						<Card.Text className="card-text">
							<strong>{totalPTO}</strong> days. {/* Display the current total PTO */}
						</Card.Text>
						<Button className="edit-btn" onClick={() => setIsEditing(true)}>
							Edit {/* Button to trigger editing mode */}
						</Button>
					</>
				) : (
					<>
						<Form.Control
							type="number"
							className="edit-input"
							value={newTotalPTO}
							onChange={(e) => setNewTotalPTO(Number(e.target.value))}
						/>
						<Button className="save-btn" onClick={handleSave} style={{ marginTop: '10px' }}>
							Save {/* Button to save the updated PTO */}
						</Button>
					</>
				)}
			</Card.Body>
		</Card>
	);
};

export default TotalPTOCard;
