const express = require('express');
const router = express.Router();
const { PTO, PTOTotal } = require('../models/PTO');
const authenticate = require('../middleware/authenticate');

// GET all PTO items for the logged-in user
router.get('/', authenticate, async (req, res) => {
	try {
		// Fetch PTO items only for the current user
		const userId = req.user.id; // `req.user` is set by the `authenticate` middleware
		const ptoItems = await PTO.find({ userId }); // Filter by userId
		res.json(ptoItems);
	} catch (err) {
		console.error('Error fetching PTO items:', err);
		res.status(500).send('Server Error');
	}
});

// GET a PTO item by ID
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const ptoItem = await PTO.findById(id);

		if (!ptoItem) {
			return res.status(404).json({ error: 'PTO item not found' });
		}

		res.json(ptoItem);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// POST a new PTO item
router.post('/', authenticate, async (req, res) => {
	try {
		const userId = req.user.id;

		const newPTO = new PTO({
			...req.body,
			userId,
		});

		const savedPTO = await newPTO.save();
		res.json(savedPTO);
	} catch (err) {
		console.error('Error saving PTO:', err);
		res.status(500).send('Server Error');
	}
});

// DELETE a PTO item by ID
router.delete('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		await PTO.findByIdAndDelete(id);
		res.status(204).send();
	} catch (err) {
		res.status(500).send('Server Error');
		console.log(err.message);
	}
});

// PUT: Update a PTO item by ID
router.put('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const { name, date } = req.body;

		// Validate input
		if (!name || !date) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		// Extract year from the date field (e.g., "2025-01-15")
		const pto_year = new Date(date).getFullYear();

		// Find PTO entry and update it
		const updatedPTO = await PTO.findByIdAndUpdate(
			id,
			{ name, date, pto_year }, // Dynamically set pto_year based on date
			{ new: true, runValidators: true } // Returns the updated document
		);

		if (!updatedPTO) {
			return res.status(404).json({ error: 'PTO item not found' });
		}

		res.json(updatedPTO);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// POST/PUT for PTO total
router.post('/pto-total', authenticate, async (req, res) => {
	const { activeYear, totalPTO } = req.body;
	const userId = req.user.id; // Assuming the user is authenticated and `req.user.id` contains the user ID.

	if (!activeYear || totalPTO === undefined) {
		return res.status(400).json({ error: 'Year and totalPTO are required.' });
	}

	try {
		// Update or create the PTO total for the user and active year
		const updatedTotal = await PTOTotal.findOneAndUpdate(
			{ activeYear, userId }, // Find by userId and activeYear
			{ activeYear, totalPTO, userId },
			{ upsert: true, new: true }
		);
		res.status(200).json(updatedTotal);
	} catch (error) {
		console.error('Error updating PTO total:', error);
		res.status(500).json({ error: 'Error updating PTO total.' });
	}
});

// GET PTO total for a year
router.get('/pto-total/:activeYear', authenticate, async (req, res) => {
	const { activeYear } = req.params;
	const userId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID (e.g., from a JWT token or session).

	try {
		// Find the PTO total for the active year and logged-in user
		const ptoTotal = await PTOTotal.findOne({ activeYear, userId });
		if (ptoTotal) {
			res.status(200).json(ptoTotal);
		} else {
			res.status(404).json({ error: `PTO total for year ${activeYear} not found for this user` });
		}
	} catch (error) {
		console.error('Error fetching PTO total:', error);
		res.status(500).json({ error: 'Error fetching PTO total.' });
	}
});

module.exports = router;
