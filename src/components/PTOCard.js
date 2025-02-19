import React, { useState } from 'react';
import { SketchPicker } from 'react-color'; // Import color picker
import '../App.css';

const PTOCard = ({ ptoList, addPTO, updatePTO, deletePTO }) => {
	const [newPTO, setNewPTO] = useState({ name: '', date: '', color: '#FF5733' });
	const [editingPTO, setEditingPTO] = useState(null);
	const [showColorPicker, setShowColorPicker] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewPTO((prev) => ({ ...prev, [name]: value }));
	};

	const handleColorChange = (color) => {
		setNewPTO((prev) => ({ ...prev, color: color.hex }));
	};

	const handleAddPTO = async (e) => {
		e.preventDefault();
		const uniqueId = Date.now().toString();
		await addPTO({ ...newPTO, unique_id: uniqueId });
		setNewPTO({ name: '', date: '', color: '#FF5733' });
		setShowColorPicker(false);
	};

	const handleEditPTO = (pto) => {
		setEditingPTO(pto);
		setNewPTO({
			name: pto.name,
			date: new Date(pto.date).toISOString().split('T')[0],
			color: pto.color || '#FF5733',
		});
		setShowColorPicker(false);
	};

	const handleUpdatePTO = async (e) => {
		e.preventDefault();
		if (editingPTO) {
			await updatePTO(editingPTO._id, newPTO);
			setEditingPTO(null);
			setNewPTO({ name: '', date: '', color: '#FF5733' });
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
								<button type="submit" className="btn btn-primary">
									{editingPTO ? 'Update PTO' : 'Add PTO'}
								</button>
								{editingPTO && (
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => {
											setEditingPTO(null);
											setNewPTO({ name: '', date: '', color: '#FF5733' });
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
