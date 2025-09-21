const mongoose = require('mongoose');
const { HABITS_MONGODB_URI } = require('../config');

const habitsConnection = mongoose.createConnection(HABITS_MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

habitsConnection.on('connected', () => {
	console.log('Connected to Habits MongoDB');
});

habitsConnection.on('error', (err) => {
	console.error('Error connecting to Habits MongoDB', err);
});

module.exports = habitsConnection;
