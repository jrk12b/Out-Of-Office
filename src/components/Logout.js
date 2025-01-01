import React from 'react';
import axios from 'axios';

const Logout = ({ onLogout }) => {
	const handleLogout = async () => {
		try {
			// Make a request to the backend logout route
			await axios.post('http://localhost:8000/api/auth/logout');
			onLogout(); // Update the app state to reflect logout (clear any logged-in state)
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
