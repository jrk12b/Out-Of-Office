const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: { type: Date, default: Date.now },
	category: { type: String, enum: ['visited', 'wishlist'], required: true },
});

module.exports = mongoose.model('Pin', PinSchema);
