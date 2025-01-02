const mongoose = require('mongoose');

const PTOSchema = new mongoose.Schema({
	unique_id: { type: String, required: true },
	name: { type: String, required: true },
	date: { type: Date, required: true },
	pto_year: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId reference
});

// Schema for total PTO per year
const PTOTotalSchema = new mongoose.Schema({
	activeYear: { type: Number, required: true },
	totalPTO: { type: Number, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId reference
});

module.exports = {
	PTO: mongoose.model('PTO', PTOSchema),
	PTOTotal: mongoose.model('PTOTotal', PTOTotalSchema),
};
