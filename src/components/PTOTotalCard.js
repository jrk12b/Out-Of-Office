import React from 'react';
import { Card } from 'react-bootstrap';

const TotalPTOCard = ({ totalPTO }) => {
  return (
    <Card style={{ width: '18rem', textAlign: 'center' }}>
      <Card.Header as="h5">Total PTO</Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>{totalPTO}</strong> days.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TotalPTOCard;
