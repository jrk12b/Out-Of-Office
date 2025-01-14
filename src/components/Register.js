import React, { useState } from 'react';
import axios from 'axios';

const { HOST } = require('../config.js');

const Register = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${HOST}/api/auth/register`, {
				username,
				password,
			});
			setMessage(response.data.message);
		} catch (error) {
			setMessage('Error registering user.');
			console.error(error);
		}
	};

	return (
		<div>
			<h2>Register</h2>
			<form onSubmit={handleRegister}>
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
				<button type="submit">Register</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default Register;
