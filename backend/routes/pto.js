const express = require('express');
const router = express.Router();
const { PTO, PTOTotal } = require('../models/PTO');
const authenticate = require('../middleware/authenticate');

// GET all PTO items for the logged-in user
router.get('/', authenticate, async (req, res) => {
	try {
		// Fetch PTO items only for the current user
		const userId = req.user.id; // `req.user` is set by the `authenticate` middleware
		const ptoItems = await PTO.find({ userId }); // Filter PTO items by userId
		res.json(ptoItems); // Send back the PTO items as the response
	} catch (err) {
		// If an error occurs, log it and send a server error response
		console.error('Error fetching PTO items:', err);
		res.status(500).send('Server Error');
	}
});

// GET a PTO item by ID
router.get('/:id', async (req, res) => {
	try {
		// Retrieve the PTO item by ID from the request parameters
		const id = req.params.id;
		const ptoItem = await PTO.findById(id);

		// If the PTO item is not found, return a 404 error
		if (!ptoItem) {
			return res.status(404).json({ error: 'PTO item not found' });
		}

		res.json(ptoItem); // Return the found PTO item
	} catch (err) {
		// Handle any server errors
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// POST a new PTO item
router.post('/', authenticate, async (req, res) => {
	try {
		// Get the user ID from the authenticated user (set by authenticate middleware)
		const userId = req.user.id;

		// Create a new PTO item using the request body and the userId
		const newPTO = new PTO({
			...req.body,
			userId,
		});

		// Save the new PTO item to the database
		const savedPTO = await newPTO.save();
		res.json(savedPTO); // Return the saved PTO item
	} catch (err) {
		// Handle any server errors
		console.error('Error saving PTO:', err);
		res.status(500).send('Server Error');
	}
});

// DELETE a PTO item by ID
router.delete('/:id', async (req, res) => {
	try {
		// Retrieve the PTO item by ID from the request parameters
		const id = req.params.id;

		// Delete the PTO item with the provided ID
		await PTO.findByIdAndDelete(id);

		// Respond with a 204 status code indicating the item has been deleted
		res.status(204).send();
	} catch (err) {
		// Handle any server errors
		res.status(500).send('Server Error');
		console.log(err.message);
	}
});

// PUT: Update a PTO item by ID
router.put('/:id', async (req, res) => {
	try {
		// Extract the ID and updated fields (name, date) from the request
		const id = req.params.id;
		const { name, date } = req.body;

		// Validate input to ensure both name and date are provided
		if (!name || !date) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		// Extract year from the date field (e.g., "2025-01-15") to set pto_year
		const pto_year = new Date(date).getFullYear();

		// Find the PTO item by ID and update it with the new data
		const updatedPTO = await PTO.findByIdAndUpdate(
			id,
			{ name, date, pto_year }, // Dynamically set pto_year based on date
			{ new: true, runValidators: true } // Returns the updated document after applying validation
		);

		// If the PTO item is not found, return a 404 error
		if (!updatedPTO) {
			return res.status(404).json({ error: 'PTO item not found' });
		}

		res.json(updatedPTO); // Return the updated PTO item
	} catch (err) {
		// Handle any server errors
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// POST/PUT for PTO total
router.post('/pto-total', authenticate, async (req, res) => {
	const { activeYear, totalPTO } = req.body;
	const userId = req.user.id; // Assuming the user is authenticated and `req.user.id` contains the user ID.

	// Ensure both activeYear and totalPTO are provided
	if (!activeYear || totalPTO === undefined) {
		return res.status(400).json({ error: 'Year and totalPTO are required.' });
	}

	try {
		// Update or create the PTO total for the user and active year
		const updatedTotal = await PTOTotal.findOneAndUpdate(
			{ activeYear, userId }, // Find by userId and activeYear
			{ activeYear, totalPTO, userId },
			{ upsert: true, new: true } // 'upsert' creates a new entry if not found, 'new' returns updated document
		);
		res.status(200).json(updatedTotal); // Return the updated or newly created PTO total
	} catch (error) {
		// Handle errors related to updating the PTO total
		console.error('Error updating PTO total:', error);
		res.status(500).json({ error: 'Error updating PTO total.' });
	}
});

// GET PTO total for a year
router.get('/pto-total/:activeYear', authenticate, async (req, res) => {
	const { activeYear } = req.params;
	const userId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID.

	try {
		// Find the PTO total for the active year and logged-in user
		const ptoTotal = await PTOTotal.findOne({ activeYear, userId });

		// If PTO total is found, return it
		if (ptoTotal) {
			res.status(200).json(ptoTotal);
		} else {
			// If not found, return a 404 error
			res.status(404).json({ error: `PTO total for year ${activeYear} not found for this user` });
		}
	} catch (error) {
		// Handle errors when fetching the PTO total
		console.error('Error fetching PTO total:', error);
		res.status(500).json({ error: 'Error fetching PTO total.' });
	}
});

module.exports = router;
