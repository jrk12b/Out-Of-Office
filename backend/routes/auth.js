const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// Create a new user
		const user = new User({ username, password });
		await user.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error registering user' });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: 'Invalid credentials' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

		// Generate JWT
		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
		res.cookie('token', token, { httpOnly: true });
		res.status(200).json({ message: 'Login successful' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error logging in' });
	}
});

router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.status(200).json({ message: 'Logout successful' });
});

// Authentication middleware
const authenticate = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });

	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(401).json({ error: 'Unauthorized' });
	}
};

module.exports = router;
