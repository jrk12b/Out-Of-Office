import React, { useState } from 'react';
import { Card, Table, Button, Form, Row, Col } from 'react-bootstrap';

const PTOCard = ({ ptoList, setPtoList }) => {
  const [newPto, setNewPto] = useState({ name: '', date: '' });
  const [editPto, setEditPto] = useState(null);

  const handleAdd = () => {
    if (newPto.name && newPto.date) {
      setPtoList([...ptoList, { id: Date.now(), ...newPto }]);
      setNewPto({ name: '', date: '' });
    }
  };

  const handleEdit = (id) => {
    const updatedList = ptoList.map((pto) =>
      pto.id === id ? { ...pto, ...editPto } : pto
    );
    setPtoList(updatedList);
    setEditPto(null);
  };

  const handleDelete = (id) => {
    setPtoList(ptoList.filter((pto) => pto.id !== id));
  };

  return (
    <Card style={{ width: '100%' }}>
      <Card.Header>PTO List</Card.Header>
      <Card.Body>
        {/* PTO Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ptoList.map((pto) => (
              <tr key={pto.id}>
                <td>
                  {editPto?.id === pto.id ? (
                    <Form.Control
                      type="text"
                      value={editPto.name}
                      onChange={(e) => setEditPto({ ...editPto, name: e.target.value })}
                    />
                  ) : (
                    pto.name
                  )}
                </td>
                <td>
                  {editPto?.id === pto.id ? (
                    <Form.Control
                      type="date"
                      value={editPto.date}
                      onChange={(e) => setEditPto({ ...editPto, date: e.target.value })}
                    />
                  ) : (
                    pto.date
                  )}
                </td>
                <td>
                  {editPto?.id === pto.id ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleEdit(pto.id)}
                      >
                        Save
                      </Button>{' '}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditPto(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => setEditPto(pto)}
                      >
                        Edit
                      </Button>{' '}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(pto.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add New PTO */}
        <Form className="mt-3">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="PTO Name"
                value={newPto.name}
                onChange={(e) => setNewPto({ ...newPto, name: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Control
                type="date"
                value={newPto.date}
                onChange={(e) => setNewPto({ ...newPto, date: e.target.value })}
              />
            </Col>
            <Col>
              <Button onClick={handleAdd} variant="primary">
                Add PTO
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PTOCard;
