const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

// Middleware function to authenticate users based on JWT token
const authenticate = (req, res, next) => {
	// Check for the presence of a JWT token in the request cookies
	const token = req.cookies.token;

	// If no token is found, return a 401 Unauthorized response
	if (!token) return res.status(401).json({ error: 'Unauthorized' });

	try {
		// Verify the token using the JWT_SECRET key
		// If the token is valid, it will decode and attach user data to the request object
		const verified = jwt.verify(token, JWT_SECRET);

		// Attach the decoded user data to the request object for later use
		req.user = verified;

		// Continue to the next middleware or route handler
		next();
	} catch (err) {
		// If token verification fails, return a 401 Unauthorized response
		res.status(401).json({ error: 'Unauthorized' });

		// Log the error for debugging purposes
		console.log(err.message);
	}
};

// Export the authenticate middleware so it can be used in other parts of the application
module.exports = authenticate;
