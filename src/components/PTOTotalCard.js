import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const { HOST } = require('../config.js');

const TotalPTOCard = ({ activeYear }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [totalPTO, setTotalPTO] = useState(0);
	const [newTotalPTO, setNewTotalPTO] = useState(0);

	useEffect(() => {
		const fetchTotalPTO = async () => {
			if (!activeYear) return;
			try {
				const response = await axios.get(`${HOST}/api/pto/pto-total/${activeYear}`, {
					withCredentials: true,
				});
				const fetchedTotalPTO = response.data.totalPTO || 0;
				setTotalPTO(fetchedTotalPTO);
				setNewTotalPTO(fetchedTotalPTO);
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
			const response = await axios.post(
				`${HOST}/api/pto/pto-total`,
				{
					activeYear,
					totalPTO: updatedTotal,
				},
				{ withCredentials: true }
			);
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
		<Card className="total-pto-card">
			<Card.Header as="h5" className="card-header">
				Total PTO for {activeYear}
			</Card.Header>
			<Card.Body>
				{!isEditing ? (
					<>
						<Card.Text className="card-text">
							<strong>{totalPTO}</strong> days.
						</Card.Text>
						<Button className="edit-btn" onClick={() => setIsEditing(true)}>
							Edit
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
							Save
						</Button>
					</>
				)}
			</Card.Body>
		</Card>
	);
};

export default TotalPTOCard;
