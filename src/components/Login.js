import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../login.css';

const { HOST } = require('../config.js');

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${HOST}/api/auth/login`,
				{ username, password },
				{ withCredentials: true }
			);
			setMessage('Login successful');
			onLogin();
			navigate('/');
		} catch (error) {
			setMessage('Invalid credentials');
			console.error(error);
		}
	};

	return (
		<div className="login-container">
			<div className="login-form">
				<h2>Login</h2>
				<form onSubmit={handleLogin}>
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
					<button type="submit" className="login-btn btn-primary">
						Login
					</button>
				</form>
				{message && <p className="message">{message}</p>}
			</div>
		</div>
	);
};

export default Login;
