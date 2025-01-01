const mongoose = require('mongoose');

const PTOSchema = new mongoose.Schema({
	unique_id: { type: String, required: true },
	name: { type: String, required: true },
	date: { type: Date, required: true },
	pto_year: { type: String, required: true },
});

// Schema for total PTO per year
const PTOTotalSchema = new mongoose.Schema({
	activeYear: { type: Number, required: true, unique: true },
	totalPTO: { type: Number, required: true },
});

module.exports = {
	PTO: mongoose.model('PTO', PTOSchema),
	PTOTotal: mongoose.model('PTOTotal', PTOTotalSchema),
};
