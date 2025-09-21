import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/auth.css';

const { HOST } = require('../../config.js'); // Get the host URL from the configuration

const Register = () => {
	// State hooks to manage user input and messages
	const [username, setUsername] = useState(''); // Store the username entered by the user
	const [password, setPassword] = useState(''); // Store the password entered by the user
	const [message, setMessage] = useState(''); // Store success/error messages to display to the user

	// Handle form submission to register a new user
	const handleRegister = async (e) => {
		e.preventDefault(); // Prevent the default form submission behavior
		try {
			// Make a POST request to register the user with the entered username and password
			const response = await axios.post(`${HOST}/api/auth/register`, {
				username,
				password,
			});
			setMessage(response.data.message); // Set the success message received from the server
		} catch (error) {
			setMessage('Error registering user.'); // Set an error message if the registration fails
			console.error(error); // Log the error to the console
		}
	};

	return (
		<div className="login-container">
			<div className="login-form">
				<h2>Register</h2> {/* Display the title of the form */}
				<form onSubmit={handleRegister}>
					{' '}
					{/* Handle form submission using handleRegister function */}
					<div className="form-group">
						<label htmlFor="username">Username:</label> {/* Label for username input */}
						<input
							type="text"
							id="username"
							value={username} // Bind the input value to the state
							onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
							required // Make this field required
							className="form-control" // Apply CSS styling for the form control
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password:</label> {/* Label for password input */}
						<input
							type="password"
							id="password"
							value={password} // Bind the input value to the state
							onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
							required // Make this field required
							className="form-control" // Apply CSS styling for the form control
						/>
					</div>
					<button type="submit" className="login-btn">
						{' '}
						{/* Button to submit the form */}
						Register
					</button>
				</form>
				{message && <p className="message">{message}</p>}{' '}
				{/* Display the message (success/error) after form submission */}
			</div>
		</div>
	);
};

export default Register;
