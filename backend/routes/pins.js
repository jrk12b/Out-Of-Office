const express = require('express');
const router = express.Router();
const Pin = require('../models/Pin');
const authenticate = require('../middleware/authenticate');

// Save a new pin
router.post('/add', authenticate, async (req, res) => {
	try {
		const { lat, lng } = req.body;
		const newPin = new Pin({ lat, lng, userId: req.user.id });

		await newPin.save();
		res.status(201).json(newPin);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
		console.log(error);
	}
});

// Get all pins for the logged-in user
router.get('/user-pins', authenticate, async (req, res) => {
	try {
		const pins = await Pin.find({ userId: req.user.id });
		res.json(pins);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
		console.log(error);
	}
});

module.exports = router;
