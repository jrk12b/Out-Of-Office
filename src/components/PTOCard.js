import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import '../App.css';

const { HOST } = require('../config.js');

const PTOCard = ({ ptoList, addPTO, updatePTO, deletePTO, activeYear }) => {
	// State for new PTO entry
	const [newPTO, setNewPTO] = useState({
		name: '',
		date: '',
		color: '#FF5733',
		pto_year: '',
	});
	// State for editing PTO
	const [editingPTO, setEditingPTO] = useState(null);
	// State for color picker visibility
	const [showColorPicker, setShowColorPicker] = useState(false);
	// State for PTO planning notes
	const [notes, setNotes] = useState('');

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const response = await fetch(`${HOST}/api/pto/notes?activeYear=${activeYear}`, {
					method: 'GET',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Failed to fetch notes');
				}

				const data = await response.json();
				setNotes(data.notes || '');
			} catch (error) {
				console.error('Error fetching notes:', error);
			}
		};

		fetchNotes();
	}, [activeYear]);

	const handleSaveNotes = async () => {
		try {
			const response = await fetch(`${HOST}/api/pto/notes`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ activeYear, notes }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Failed to save notes');
			}
		} catch (error) {
			console.error('Error saving notes:', error);
			alert(error.message);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPTO((prev) => ({ ...prev, [name]: value }));
	};

	const handleColorChange = (color) => {
		setNewPTO((prev) => ({ ...prev, color: color.hex }));
	};

	const handleAddPTO = async (e) => {
		e.preventDefault();
		const { startDate, endDate } = newPTO;

		// Validate if both startDate and endDate are present
		if (startDate && endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);

			// Check if end date is after start date
			if (end < start) {
				alert('End date must be after start date');
				return;
			}

			// Generate PTO items for each day in the range
			const ptoEntries = [];
			let currentDate = start;
			while (currentDate <= end) {
				// Generate unique_id for each PTO entry
				const uniqueId = Date.now().toString() + currentDate.toISOString();
				ptoEntries.push({
					...newPTO,
					date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
					unique_id: uniqueId, // Add unique_id
				});
				currentDate.setDate(currentDate.getDate() + 1); // Increment day
			}

			// Add each PTO entry
			for (const entry of ptoEntries) {
				await addPTO(entry);
			}

			// Reset the form
			setNewPTO({ name: '', startDate: '', endDate: '', color: '#FF5733', pto_year: '' });
			setShowColorPicker(false);
		} else {
			alert('Please provide both start and end dates.');
		}
	};

	const handleEditPTO = (pto) => {
		setEditingPTO(pto);
		setNewPTO({
			name: pto.name,
			startDate: new Date(pto.date).toISOString().split('T')[0],
			endDate: new Date(pto.date).toISOString().split('T')[0], // Single day for editing
			color: pto.color || '#FF5733',
			pto_year: pto.pto_year || '',
		});
		setShowColorPicker(false);
	};

	const handleUpdatePTO = async (e) => {
		e.preventDefault();
		if (editingPTO) {
			await updatePTO(editingPTO._id, newPTO);
			setEditingPTO(null);
			setNewPTO({ name: '', startDate: '', endDate: '', color: '#FF5733', pto_year: '' });
			setShowColorPicker(false);
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
								{/* PTO Start Date Input */}
								<div className="mb-3">
									<label htmlFor="startDate" className="form-label">
										Start Date
									</label>
									<input
										type="date"
										id="startDate"
										name="startDate"
										className="form-control dark-input"
										value={newPTO.startDate}
										onChange={handleInputChange}
										required
									/>
								</div>
								{/* PTO End Date Input */}
								<div className="mb-3">
									<label htmlFor="endDate" className="form-label">
										End Date
									</label>
									<input
										type="date"
										id="endDate"
										name="endDate"
										className="form-control dark-input"
										value={newPTO.endDate}
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
										value={newPTO.pto_year}
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
											setNewPTO({ name: '', date: '', color: '#FF5733', pto_year: '' });
										}}
										style={{ marginLeft: '10px' }}
									>
										Cancel
									</button>
								)}
							</form>
						</div>
					</div>
					{/* Notes Section */}
					<div className="mb-3">
						<label htmlFor="notes" className="form-label">
							Notes for {activeYear}
						</label>
						<textarea
							id="notes"
							className="form-control dark-input"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
						<button className="btn btn-success mt-2" onClick={handleSaveNotes}>
							Save Notes
						</button>
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
