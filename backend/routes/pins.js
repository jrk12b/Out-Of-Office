const express = require('express');
const router = express.Router();
const Pin = require('../models/Pin');
const authenticate = require('../middleware/authenticate');

// Route to save a new pin
router.post('/add', authenticate, async (req, res) => {
	try {
		const { lat, lng, category } = req.body;

		// Validate category input to ensure it's either 'visited' or 'wishlist'
		if (!['visited', 'wishlist'].includes(category)) {
			return res.status(400).json({ error: 'Invalid category. Use "visited" or "wishlist".' });
		}

		// Create a new pin with the provided data, associating it with the logged-in user
		const newPin = new Pin({ lat, lng, category, userId: req.user.id });

		// Save the new pin to the database
		await newPin.save();
		// Respond with the newly created pin
		res.status(201).json(newPin);
	} catch (error) {
		// Handle any server errors
		res.status(500).json({ error: 'Server error' });
		console.log(error);
	}
});

// Route to get all pins for the logged-in user
router.get('/user-pins', authenticate, async (req, res) => {
	try {
		// Find all pins belonging to the logged-in user
		const pins = await Pin.find({ userId: req.user.id });
		// Respond with the list of pins
		res.json(pins);
	} catch (error) {
		// Handle any server errors
		res.status(500).json({ error: 'Server error' });
		console.log(error);
	}
});

// Route to delete a pin by its ID
router.delete('/delete/:id', authenticate, async (req, res) => {
	try {
		// Find the pin by its ID from the route parameter
		const pin = await Pin.findById(req.params.id);

		// If the pin doesn't exist, return a 404 error
		if (!pin) {
			return res.status(404).json({ error: 'Pin not found' });
		}

		// Ensure that the pin belongs to the logged-in user
		if (pin.userId.toString() !== req.user.id) {
			// If the user is not authorized to delete this pin, return a 403 error
			return res.status(403).json({ error: 'Not authorized' });
		}

		// Delete the pin from the database
		await Pin.findByIdAndDelete(req.params.id);
		// Respond with a success message
		res.json({ message: 'Pin deleted successfully' });
	} catch (error) {
		// Handle any server errors
		res.status(500).json({ error: 'Server error' });
		console.log(error);
	}
});

module.exports = router;
