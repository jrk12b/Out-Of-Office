import React, { useState } from 'react';

const PTOCard = ({ ptoList, addPTO, deletePTO }) => {
  const [newPTO, setNewPTO] = useState({ name: '', date: '', pto_year: '' });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPTO((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new PTO item
  const handleAddPTO = async (e) => {
    e.preventDefault();
    const uniqueId = Date.now().toString(); // Generate unique ID for the new PTO
    await addPTO({ ...newPTO, unique_id: uniqueId });
    setNewPTO({ name: '', date: '', pto_year: '' }); // Clear form fields
  };

  // Delete a PTO item
  const handleDeletePTO = async (id) => {
    await deletePTO(id);
  };

  return (
    <div className="card">
      <div className="card-header">Days of PTO</div>

      {/* PTO Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ptoList.map((pto) => (
            <tr key={pto._id}>
              <td>{pto.name}</td>
              <td>{new Date(pto.date).toLocaleDateString()}</td>
              <td>{pto.pto_year}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeletePTO(pto._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add PTO Form */}
      <div className="card-body">
        <h5>Add PTO Item</h5>
        <form onSubmit={handleAddPTO}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={newPTO.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={newPTO.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pto_year" className="form-label">Year</label>
            <input
              type="text"
              id="pto_year"
              name="pto_year"
              className="form-control"
              value={newPTO.pto_year}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add PTO</button>
        </form>
      </div>
    </div>
  );
};

export default PTOCard;
