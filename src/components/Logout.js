import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ onLogout }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			// Send a request to the backend to clear the cookie
			await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });

			// Call the logout function passed as a prop to reset the login state
			onLogout();

			// Optionally, redirect the user to the login page after logout
			navigate('/login');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<button onClick={handleLogout} className="btn btn-danger">
			Logout
		</button>
	);
};

export default Logout;
