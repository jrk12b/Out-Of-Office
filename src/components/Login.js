import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { HOST } = require('../config.js');

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	console.log(`username: ${username}`);
	const [password, setPassword] = useState('');
	console.log(`password: ${username}`);
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			console.log(`host: ${HOST}`);
			console.log(`username2: ${username}`);
			console.log(`password2: ${password}`);
			const response = await axios.post(
				`${HOST}/api/auth/login`,
				{
					username,
					password,
				},
				{
					withCredentials: true, // This ensures cookies are sent with the request
				}
			);
			setMessage('Login successful');
			onLogin(); // Update the app state to reflect login
			navigate('/'); // Navigate to the home page (main app)
		} catch (error) {
			setMessage('Invalid credentials');
			console.error(error);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default Login;
