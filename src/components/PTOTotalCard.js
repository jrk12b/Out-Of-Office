import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const TotalPTOCard = ({ totalPTO, updateTotalPTO }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTotalPTO, setNewTotalPTO] = useState(totalPTO);

  const handleSave = () => {
    updateTotalPTO(newTotalPTO); // Update the total PTO for the active year
    setIsEditing(false); // Exit edit mode
  };

  return (
    <Card style={{ width: '18rem', textAlign: 'center' }}>
      <Card.Header as="h5">Total PTO</Card.Header>
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
