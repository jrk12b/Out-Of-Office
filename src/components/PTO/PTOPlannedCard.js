import React from 'react';
import { Card } from 'react-bootstrap';

const PTOPlannedCard = ({ ptoCount }) => {
	return (
		<Card className="planned-pto-card">
			<Card.Header as="h5" className="card-header">
				PTO Planned
			</Card.Header>
			<Card.Body>
				<Card.Text className="card-text">
					<strong>{ptoCount}</strong> PTO(s) planned.
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default PTOPlannedCard;
