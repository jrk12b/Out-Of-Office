import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import '../App.css';

const PTOCard = ({ ptoList, addPTO, updatePTO, deletePTO, activeYear }) => {
	// State to manage new PTO entry form and color selection
	const [newPTO, setNewPTO] = useState({
		name: '',
		date: '',
		color: '#FF5733',
		pto_year: activeYear,
	});
	// State to manage currently edited PTO item
	const [editingPTO, setEditingPTO] = useState(null);
	// State to toggle the color picker visibility
	const [showColorPicker, setShowColorPicker] = useState(false);

	// Handles form input changes (name, date, and year)
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPTO((prev) => ({ ...prev, [name]: value }));
	};

	// Updates the color in the newPTO state when the color picker changes
	const handleColorChange = (color) => {
		setNewPTO((prev) => ({ ...prev, color: color.hex }));
	};

	// Handles adding a new PTO item, sends it to the parent function (addPTO)
	const handleAddPTO = async (e) => {
		e.preventDefault(); // Prevents form submission
		const uniqueId = Date.now().toString(); // Create a unique ID for the new PTO
		await addPTO({ ...newPTO, unique_id: uniqueId }); // Pass new PTO to parent function
		setNewPTO({ name: '', date: '', color: '#FF5733', year: activeYear }); // Reset the form after adding PTO
		setShowColorPicker(false); // Hide the color picker
	};

	// Prepares the PTO form for editing when an existing PTO is clicked
	const handleEditPTO = (pto) => {
		setEditingPTO(pto); // Set the PTO to be edited
		setNewPTO({
			name: pto.name,
			date: new Date(pto.date).toISOString().split('T')[0], // Convert date to 'YYYY-MM-DD' format
			color: pto.color || '#FF5733', // Set color, default to red if not specified
			year: pto.pto_year || activeYear, // Set year, use activeYear if not specified
		});
		setShowColorPicker(false); // Hide the color picker when editing
	};

	// Handles updating an existing PTO, sends the updated PTO to the parent function (updatePTO)
	const handleUpdatePTO = async (e) => {
		e.preventDefault(); // Prevents form submission
		if (editingPTO) {
			await updatePTO(editingPTO._id, newPTO); // Update the PTO with the new data
			setEditingPTO(null); // Reset the editing state
			setNewPTO({ name: '', date: '', color: '#FF5733', year: activeYear }); // Reset the form
			setShowColorPicker(false); // Hide the color picker
		}
	};

	return (
		<div className="container">
			<div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div className="col-md-5">
					<div className="card dark-card">
						<div className="card-header dark-card-header">
							{editingPTO ? 'Edit PTO Item' : 'Add PTO Item'}
						</div>
						<div className="card-body">
							<form onSubmit={editingPTO ? handleUpdatePTO : handleAddPTO}>
								{/* PTO Name Input */}
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
								{/* PTO Date Input */}
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
								{/* PTO Year Input */}
								<div className="mb-3">
									<label htmlFor="year" className="form-label">
										Year
									</label>
									<input
										type="number"
										id="pto_year"
										name="pto_year"
										className="form-control dark-input"
										value={newPTO.year}
										onChange={handleInputChange}
										required
									/>
								</div>
								{/* Color Picker */}
								<div className="mb-3">
									<label className="form-label">Pick a Color</label>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											cursor: 'pointer',
										}}
									>
										<div
											style={{
												width: '30px',
												height: '30px',
												borderRadius: '50%',
												backgroundColor: newPTO.color,
												border: '1px solid #ccc',
												marginRight: '10px',
											}}
											onClick={() => setShowColorPicker(!showColorPicker)}
										></div>
										{showColorPicker && (
											<SketchPicker color={newPTO.color} onChangeComplete={handleColorChange} />
										)}
									</div>
								</div>
								{/* Submit Button */}
								<button type="submit" className="btn btn-primary">
									{editingPTO ? 'Update PTO' : 'Add PTO'}
								</button>
								{/* Cancel Button for Editing */}
								{editingPTO && (
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => {
											setEditingPTO(null);
											setNewPTO({ name: '', date: '', color: '#FF5733', year: activeYear });
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
				{/* PTO List Table */}
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
										<th>Color</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{ptoList.map((pto) => (
										<tr key={pto._id}>
											<td>{pto.name}</td>
											<td>{new Date(pto.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
											<td>{pto.pto_year}</td>
											<td>
												<div
													style={{
														width: '20px',
														height: '20px',
														backgroundColor: pto.color,
														borderRadius: '50%',
														border: '1px solid #ccc',
													}}
												></div>
											</td>
											<td>
												<button
													className="btn btn-warning btn-sm"
													onClick={() => handleEditPTO(pto)}
												>
													Edit
												</button>
												<button
													className="btn btn-danger btn-sm"
													onClick={() => deletePTO(pto._id)}
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
