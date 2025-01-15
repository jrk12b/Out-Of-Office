import React, { useState } from 'react';
import '../App.css';

const PTOCard = ({ ptoList, addPTO, updatePTO, deletePTO }) => {
	const [newPTO, setNewPTO] = useState({ name: '', date: '' });
	const [editingPTO, setEditingPTO] = useState(null); // Track the PTO being edited

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
		setNewPTO({ name: '', date: '' });
	};

	// Delete a PTO item
	const handleDeletePTO = async (id) => {
		await deletePTO(id);
	};

	// Edit an existing PTO item
	const handleEditPTO = (pto) => {
		setEditingPTO(pto); // Set the PTO to be edited
		setNewPTO({
			name: pto.name,
			date: new Date(pto.date).toISOString().split('T')[0],
		});
	};

	// Update an existing PTO item
	const handleUpdatePTO = async (e) => {
		e.preventDefault();
		if (editingPTO) {
			await updatePTO(editingPTO._id, newPTO); // Update the PTO item
			setEditingPTO(null); // Exit edit mode
			setNewPTO({ name: '', date: '' }); // Clear form fields
		}
	};

	return (
		<div className="container">
			<div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
				{/* Add or Edit PTO Form Card */}
				<div className="col-md-5">
					<div className="card dark-card">
						<div className="card-header dark-card-header">
							{editingPTO ? 'Edit PTO Item' : 'Add PTO Item'}
						</div>
						<div className="card-body">
							<form onSubmit={editingPTO ? handleUpdatePTO : handleAddPTO}>
								<div className="mb-3">
									<label htmlFor="name" className="form-label">
										Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										className="form-control dark-input"
										value={newPTO.name}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="date" className="form-label">
										Date
									</label>
									<input
										type="date"
										id="date"
										name="date"
										className="form-control dark-input"
										value={newPTO.date}
										onChange={handleInputChange}
										required
									/>
								</div>
								<button type="submit" className="btn btn-primary">
									{editingPTO ? 'Update PTO' : 'Add PTO'}
								</button>
								{editingPTO && (
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => {
											setEditingPTO(null);
											setNewPTO({ name: '', date: '' });
										}}
										style={{ marginLeft: '10px' }}
									>
										Cancel
									</button>
								)}
							</form>
						</div>
					</div>
				</div>
				{/* PTO Table Card */}
				<div className="col-md-6">
					<div className="card dark-card">
						<div className="card-header dark-card-header">Days of PTO</div>
						<div className="card-body">
							<table className="table dark-table">
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
													className="btn btn-warning btn-sm"
													onClick={() => handleEditPTO(pto)}
												>
													Edit
												</button>
												<button
													className="btn btn-danger btn-sm"
													onClick={() => handleDeletePTO(pto._id)}
													style={{ marginLeft: '5px' }}
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PTOCard;
