const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

const JWT_SECRET = 'your_jwt_secret';

const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
	const { username, password } = req.body;
	try {
		// Checking if the username already exists in the database
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			// If the user already exists, return an error response
			return res.status(400).json({ error: 'User already exists' });
		}

		// If the username doesn't exist, create a new user
		const user = new User({ username, password });
		await user.save(); // Save the new user to the database
		res.status(201).json({ message: 'User registered successfully' }); // Respond with success message
	} catch (err) {
		// Handle any errors during registration
		console.error(err);
		res.status(500).json({ error: 'Error registering user' });
	}
});

// Route to login an existing user
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		// Check if the user exists in the database
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: 'Invalid credentials' });

		// Compare the provided password with the hashed password stored in the database
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

		// If the credentials are correct, generate a JWT token for the user
		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

		// Set the JWT token as an HTTP-only cookie with additional security options
		const isProduction = process.env.NODE_ENV === 'production';
		res.cookie('token', token, {
			httpOnly: true, // Prevent client-side access to the cookie
			secure: isProduction, // Ensures the cookie is only sent over HTTPS in production
			sameSite: isProduction ? 'none' : 'lax', // 'none' for production, 'lax' for local
		});
		res.status(200).json({ message: 'Login successful' });
	} catch (err) {
		// Handle any errors during login
		console.error(err);
		res.status(500).json({ error: 'Error logging in' });
	}
});

// Route to log out the user by clearing the JWT cookie
router.post('/logout', (req, res) => {
	const isProduction = process.env.NODE_ENV === 'production';
	// Clear the JWT token cookie
	res.clearCookie('token', {
		httpOnly: true, // Prevent client-side access to the cookie
		secure: isProduction, // Ensures the cookie is only sent over HTTPS in production
		sameSite: isProduction ? 'none' : 'lax', // 'none' for production, 'lax' for local
	});

	res.status(200).json({ message: 'Logout successful' });
});

// Route to fetch the current logged-in user's details
router.get('/me', authenticate, async (req, res) => {
	try {
		// Fetch the user from the database using the ID stored in the JWT
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ error: 'User not found' });

		// Respond with the user's details (username and userId)
		res.status(200).json({
			username: user.username,
			userId: user._id,
		});
	} catch (err) {
		// Handle any errors while fetching the user details
		console.error(err);
		res.status(500).json({ error: 'Error fetching user details' });
	}
});

module.exports = router;
