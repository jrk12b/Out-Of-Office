import React from 'react';
import { Card } from 'react-bootstrap';

const PTOPlannedCard = ({ ptoCount }) => {
	return (
		<Card style={{ width: '18rem', textAlign: 'center' }}>
			<Card.Header as="h5">PTO Planned</Card.Header>
			<Card.Body>
				<Card.Text>
					<strong>{ptoCount}</strong> PTO(s) planned.
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default PTOPlannedCard;
