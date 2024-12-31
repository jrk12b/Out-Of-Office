const mongoose = require('mongoose');

const PTOSchema = new mongoose.Schema({
  unique_id: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  pto_year: { type: String, required: true },
});

module.exports = mongoose.model('PTO', PTOSchema);
