const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ptoRoutes = require('./routes/pto');
const cookieParser = require('cookie-parser');
const { exec } = require('child_process');
const authRoutes = require('./routes/auth');
const pinRoutes = require('./routes/pins');

const frontend = process.env.FRONTEND;
if (frontend === 'true') {
	exec('serve -s build', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
} else {
	const { PORT, MONGODB_URI, CORS_ORIGIN } = require('../config.js');
	const app = express();
	app.use(cookieParser());
	app.use(express.json());

	// Enable CORS for all origins (you can restrict this later for security reasons)
	app.use(
		cors({
			origin: CORS_ORIGIN,
			credentials: true,
		})
	);

	mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('Connected to MongoDB'))
		.catch((err) => console.error('Error connecting to MongoDB', err));

	app.use('/api/pto', ptoRoutes);
	app.use('/api/auth', authRoutes);
	app.use('/api/pins', pinRoutes);

	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
