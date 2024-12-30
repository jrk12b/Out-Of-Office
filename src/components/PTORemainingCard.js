import React from 'react';
import { Card } from 'react-bootstrap';

const PTORemainingCard = ({ ptoRemaining }) => {
  return (
    <Card style={{ width: '18rem', textAlign: 'center' }}>
      <Card.Header as="h5">PTO Remaining</Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>{ptoRemaining}</strong> days left.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PTORemainingCard;
