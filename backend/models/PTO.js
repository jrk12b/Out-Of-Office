const mongoose = require('mongoose');

const PTOSchema = new mongoose.Schema({
	unique_id: { type: String, required: true },
	name: { type: String, required: true },
	date: { type: Date, required: true },
	pto_year: { type: String },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Middleware to automatically set the pto_year
PTOSchema.pre('save', function (next) {
	if (this.date) {
		// Extract the year from the date
		this.pto_year = this.date.getFullYear().toString();
	}
	next();
});

// Schema for total PTO per year
const PTOTotalSchema = new mongoose.Schema({
	activeYear: { type: Number, required: true },
	totalPTO: { type: Number, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = {
	PTO: mongoose.model('PTO', PTOSchema),
	PTOTotal: mongoose.model('PTOTotal', PTOTotalSchema),
};
