import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { HOST } = require('../config.js');

const Logout = ({ onLogout }) => {
	const navigate = useNavigate(); // Initializing useNavigate to handle page redirection

	// Handle logout logic
	const handleLogout = async () => {
		try {
			// Sending a POST request to the logout endpoint, using withCredentials to ensure cookies are sent
			await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
			onLogout(); // Notify parent component that the user has logged out
			navigate('/login'); // Redirecting to the login page after successful logout
		} catch (error) {
			// Handling errors during the logout process
			console.error('Error during logout:', error); // Logging any errors that occur
		}
	};

	return (
		// Button that triggers the logout when clicked
		<button onClick={handleLogout} className="btn btn-danger">
			Logout
		</button>
	);
};

export default Logout; // Exporting the Logout component for use in other parts of the app
