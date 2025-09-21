const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ptoRoutes = require('./routes/pto');
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');
const authRoutes = require('./routes/auth');
const pinRoutes = require('./routes/pins');
const habitRoutes = require('./routes/habits');

// Check if frontend environment variable is set to 'true'
const frontend = process.env.FRONTEND;
if (frontend === 'true') {
	// If in frontend mode, execute a command to serve the static build
	exec('serve -s build', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		// Log the output from the command (usually the serving process logs)
		console.log(`stdout: ${stdout}`);
	});
} else {
	// In development mode, use the configuration from a config file
	const { PORT, MONGODB_URI, CORS_ORIGIN } = require('../config.js');
	const app = express(); // Initialize the Express application

	// Middleware to parse cookies from incoming requests
	app.use(cookieParser());

	// Middleware to parse JSON data in request bodies
	app.use(express.json());

	// Enable CORS (Cross-Origin Resource Sharing)
	// This allows requests from specific origins (CORS_ORIGIN) and includes credentials (cookies)
	app.use(
		cors({
			origin: CORS_ORIGIN, // Origin allowed to make requests
			credentials: true, // Allow cookies to be sent along with requests
		})
	);

	// Connect to MongoDB using mongoose
	mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true, // Use the new MongoDB driver URL parser
			useUnifiedTopology: true, // Use the new unified topology engine for MongoDB
		})
		.then(() => console.log('Connected to MongoDB')) // Log success
		.catch((err) => console.error('Error connecting to MongoDB', err)); // Log error if connection fails

	// Create a separate connection for the Habits DB
	require('./habitsDb.js');

	// Define API routes
	app.use('/api/pto', ptoRoutes); // Use the PTO routes for /api/pto endpoints
	app.use('/api/auth', authRoutes); // Use the authentication routes for /api/auth endpoints
	app.use('/api/pins', pinRoutes); // Use the pins routes for /api/pins endpoints
	app.use('/api', habitRoutes);

	// Start the Express server and listen on the specified port
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
