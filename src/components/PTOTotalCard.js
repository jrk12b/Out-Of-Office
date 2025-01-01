import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const TotalPTOCard = ({ activeYear }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [totalPTO, setTotalPTO] = useState(0);
	const [newTotalPTO, setNewTotalPTO] = useState(0);

	useEffect(() => {
		const fetchTotalPTO = async () => {
			if (!activeYear) return; // Ensure year is valid
			try {
				const response = await axios.get(`http://localhost:8000/api/pto/pto-total/${activeYear}`);
				const fetchedTotalPTO = response.data.totalPTO || 0; // Default to 0 if not found
				setTotalPTO(fetchedTotalPTO);
				setNewTotalPTO(fetchedTotalPTO); // Sync newTotalPTO with the fetched value
			} catch (error) {
				console.error('Error fetching total PTO:', error);
			}
		};

		fetchTotalPTO();
	}, [activeYear]);

	const updateTotalPTO = async (updatedTotal) => {
		if (!activeYear) {
			console.error('Year is required to update PTO total.');
			return;
		}

		try {
			const response = await axios.post('http://localhost:8000/api/pto/pto-total', {
				activeYear,
				totalPTO: updatedTotal,
			});
			setTotalPTO(response.data.totalPTO);
		} catch (error) {
			console.error('Error updating total PTO:', error);
		}
	};

	const handleSave = () => {
		updateTotalPTO(newTotalPTO);
		setIsEditing(false);
	};

	return (
		<Card style={{ width: '18rem', textAlign: 'center' }}>
			<Card.Header as="h5">Total PTO for {activeYear}</Card.Header>
			<Card.Body>
				{!isEditing ? (
					<>
						<Card.Text>
							<strong>{totalPTO}</strong> days.
						</Card.Text>
						<Button onClick={() => setIsEditing(true)}>Edit</Button>
					</>
				) : (
					<>
						<Form.Control
							type="number"
							value={newTotalPTO}
							onChange={(e) => setNewTotalPTO(Number(e.target.value))}
						/>
						<Button variant="success" onClick={handleSave} style={{ marginTop: '10px' }}>
							Save
						</Button>
					</>
				)}
			</Card.Body>
		</Card>
	);
};

export default TotalPTOCard;
