const mongoose = require('mongoose');

// Defining a schema for the 'Pin' collection in MongoDB
const PinSchema = new mongoose.Schema({
	// Latitude of the pin (required number field)
	lat: { type: Number, required: true },

	// Longitude of the pin (required number field)
	lng: { type: Number, required: true },

	// User ID associated with the pin, referencing the 'User' model (required field)
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	// Date the pin was created (defaults to the current date if not provided)
	createdAt: { type: Date, default: Date.now },

	// Category of the pin, restricted to 'visited' or 'wishlist' values
	category: {
		type: String,
		enum: ['visited', 'wishlist'], // Enforcing specific values for category
		required: true, // Field is mandatory
	},
});

module.exports = mongoose.model('Pin', PinSchema);
