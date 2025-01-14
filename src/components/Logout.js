import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { HOST } = require('../config.js');

const Logout = ({ onLogout }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
			onLogout(); // Notify parent about logout
			navigate('/login'); // Redirect to login
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
