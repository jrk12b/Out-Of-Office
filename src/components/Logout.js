import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Call the logout function passed as a prop to reset the login state
		onLogout();

		// Optionally, redirect the user to the login page after logout
		navigate('/login');
	};

	return (
		<button onClick={handleLogout} className="btn btn-danger">
			Logout
		</button>
	);
};

export default Logout;
