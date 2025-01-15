import React from 'react';
import { Card } from 'react-bootstrap';

const PTORemainingCard = ({ ptoRemaining }) => {
	return (
		<Card className="remaining-pto-card">
			<Card.Header as="h5" className="card-header">
				PTO Remaining
			</Card.Header>
			<Card.Body>
				<Card.Text className="card-text">
					<strong>{ptoRemaining}</strong> days left.
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default PTORemainingCard;
