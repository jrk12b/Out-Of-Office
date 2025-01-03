const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

const JWT_SECRET = 'your_jwt_secret';
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

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

		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
		res.cookie('token', token, { httpOnly: true });
		res.status(200).json({ message: 'Login successful' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error logging in' });
	}
});

// Logout route
router.post('/logout', (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'Strict',
	});
	res.status(200).json({ message: 'Logout successful' });
});

// Get current user's details
router.get('/me', authenticate, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ error: 'User not found' });

		res.status(200).json({
			username: user.username,
			userId: user._id,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Error fetching user details' });
	}
});

module.exports = router;
