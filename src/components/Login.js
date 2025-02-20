import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../auth.css';

const { HOST } = require('../config.js');

const Login = ({ onLogin }) => {
	// State to manage form inputs and messages
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate(); // Using the useNavigate hook to navigate between pages

	// Handle login form submission
	const handleLogin = async (e) => {
		e.preventDefault(); // Preventing default form submission behavior
		try {
			// Sending a POST request to the login endpoint with the username and password
			const response = await axios.post(
				`${HOST}/api/auth/login`, // API endpoint to authenticate the user
				{ username, password }, // Sending the username and password as the request body
				{ withCredentials: true } // Ensuring cookies (credentials) are sent with the request
			);
			console.log(response); // Logging the response from the server
			setMessage('Login successful'); // Setting success message
			onLogin(); // Calling the onLogin function passed as a prop to update the app state
			navigate('/'); // Redirecting to the home page after successful login
		} catch (error) {
			// Handling errors if login fails
			setMessage('Invalid credentials'); // Displaying error message
			console.error(error); // Logging the error to the console
		}
	};

	return (
		<div className="login-container">
			<div className="login-form">
				<h2>Login</h2>
				{/* Login form */}
				<form onSubmit={handleLogin}>
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						{/* Input field for username */}
						<input
							type="text"
							id="username"
							value={username} // Binding value to the username state
							onChange={(e) => setUsername(e.target.value)} // Updating the username state on input change
							required // Making the input required
							className="form-control" // Adding class for styling
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password:</label>
						{/* Input field for password */}
						<input
							type="password"
							id="password"
							value={password} // Binding value to the password state
							onChange={(e) => setPassword(e.target.value)} // Updating the password state on input change
							required // Making the input required
							className="form-control" // Adding class for styling
						/>
					</div>
					{/* Submit button */}
					<button type="submit" className="login-btn btn-primary">
						Login
					</button>
				</form>
				{/* Display message (success or error) */}
				{message && <p className="message">{message}</p>}

				{/* Register link for users who don't have an account */}
				<div className="register-link">
					<p>
						Not a user?{' '}
						<Link to="/register" className="btn btn-link">
							Register here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
