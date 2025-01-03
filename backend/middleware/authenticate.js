const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const authenticate = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });

	try {
		const verified = jwt.verify(token, JWT_SECRET);
		req.user = verified; // Attach user data to request object
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		res.status(401).json({ error: 'Unauthorized' });
	}
};

module.exports = authenticate;
