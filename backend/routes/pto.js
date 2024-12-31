const express = require('express');
const router = express.Router();
const PTO = require('../models/PTO'); // Assuming PTO is your Mongoose model

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

module.exports = router;
