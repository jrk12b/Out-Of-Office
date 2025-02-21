const mongoose = require('mongoose');

// Defining a schema for the 'PTO' (Paid Time Off) collection in MongoDB
const PTOSchema = new mongoose.Schema({
	// Unique identifier for the PTO entry (required field)
	unique_id: { type: String, required: true },

	// Name of the employee or person taking PTO (required field)
	name: { type: String, required: true },

	// Date of the PTO request (required field)
	date: { type: Date, required: true },

	// Year of the PTO, to be automatically set using middleware
	pto_year: { type: String },

	// User ID associated with the PTO request, referencing the 'User' model (required field)
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	// Color code associated with the PTO (defaults to a specific color if not provided)
	color: { type: String, default: '#FF5733' },
});

// Defining a schema for tracking total PTO available per year for each user
const PTOTotalSchema = new mongoose.Schema({
	// Active year for PTO tracking (required field)
	activeYear: { type: Number, required: true },

	// Total amount of PTO available for the active year (required field)
	totalPTO: { type: Number, required: true },

	// User ID associated with the total PTO, referencing the 'User' model (required field)
	userId: {
		type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
		ref: 'User', // Reference to the 'User' model
		required: true,
	},

	notes: { type: String, default: '' },
});

module.exports = {
	PTO: mongoose.model('PTO', PTOSchema),
	PTOTotal: mongoose.model('PTOTotal', PTOTotalSchema),
};
