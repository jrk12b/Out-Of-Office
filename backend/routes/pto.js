const express = require('express');
const router = express.Router();
const PTO = require('../models/PTO'); // Assuming PTO is your Mongoose model

// GET all PTO items
router.get('/', async (req, res) => { // No need to add '/api/pto' here
  try {
    const ptoItems = await PTO.find();
    res.json(ptoItems);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new PTO item
router.post('/', async (req, res) => { // No need to add '/api/pto' here
  try {
    const newPTO = new PTO(req.body);
    const savedPTO = await newPTO.save();
    res.json(savedPTO);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE a PTO item by ID
router.delete('/:id', async (req, res) => { // No need to add '/api/pto' here
  try {
    const id = req.params.id;
    await PTO.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
