import React, { useState } from 'react';
import axios from 'axios';
import '../auth.css';

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
		<div className="login-container">
			<div className="login-form">
				<h2>Register</h2>
				<form onSubmit={handleRegister}>
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="form-control"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="form-control"
						/>
					</div>
					<button type="submit" className="login-btn">
						Register
					</button>
				</form>
				{message && <p className="message">{message}</p>}
			</div>
		</div>
	);
};

export default Register;
