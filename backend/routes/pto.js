const express = require('express');
const router = express.Router();
const { PTO, PTOTotal } = require('../models/PTO');

// GET all PTO items
router.get('/', async (req, res) => {
	try {
		const ptoItems = await PTO.find();
		res.json(ptoItems);
	} catch (err) {
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
router.post('/', async (req, res) => {
	try {
		const newPTO = new PTO(req.body);
		const savedPTO = await newPTO.save();
		res.json(savedPTO);
	} catch (err) {
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
	}
});

// PUT: Update a PTO item by ID
router.put('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const { name, date, pto_year } = req.body;

		// Validate input
		if (!name || !date || !pto_year) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		// Find PTO entry and update it
		const updatedPTO = await PTO.findByIdAndUpdate(
			id,
			{ name, date, pto_year },
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
router.post('/pto-total', async (req, res) => {
	const { activeYear, totalPTO } = req.body;

	if (!activeYear || totalPTO === undefined) {
		return res.status(400).json({ error: 'Year and totalPTO are required.' });
	}

	try {
		const updatedTotal = await PTOTotal.findOneAndUpdate(
			{ activeYear },
			{ activeYear, totalPTO },
			{ upsert: true, new: true }
		);
		res.status(200).json(updatedTotal);
	} catch (error) {
		console.error('Error updating PTO total:', error);
		res.status(500).json({ error: 'Error updating PTO total.' });
	}
});

// GET PTO total for a year
router.get('/pto-total/:activeYear', async (req, res) => {
	const { activeYear } = req.params;

	try {
		const ptoTotal = await PTOTotal.findOne({ activeYear: activeYear });
		if (ptoTotal) {
			res.status(200).json(ptoTotal);
		} else {
			res.status(404).json({ error: `PTO total for year ${activeYear} not found` });
		}
	} catch (error) {
		console.error('Error fetching PTO total:', error);
		res.status(500).json({ error: 'Error fetching PTO total.' });
	}
});

module.exports = router;
