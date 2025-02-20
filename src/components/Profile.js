import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import axios from 'axios';

const { HOST } = require('../config.js'); // Import the host URL from the config file

const ProfilePage = () => {
	// State to store user data
	const [user, setUser] = useState(null);

	// Effect hook to fetch user data when the component mounts
	useEffect(() => {
		// Function to fetch user data from the backend
		const fetchUserData = async () => {
			try {
				// Send a GET request to the /api/auth/me endpoint to fetch the logged-in user's data
				const response = await axios.get(`${HOST}/api/auth/me`, { withCredentials: true });

				// Set the user data into state if the request is successful
				setUser(response.data);
			} catch (error) {
				// Log an error if the request fails and reset the user state to null
				console.error('Error fetching user data:', error.response?.data || error.message);
				setUser(null); // Reset the user state in case of an error
			}
		};

		// Call the function to fetch user data when the component mounts
		fetchUserData();
	}, []); // The effect will run only once, on component mount

	return (
		<Container className="mt-5">
			{' '}
			{/* Bootstrap container to center content and add margin-top */}
			{/* Check if user data has been successfully loaded */}
			{user ? (
				<Card className="shadow-sm">
					{' '}
					{/* Display user data in a Card component */}
					<Card.Body>
						<Card.Title>Welcome, {user.username}!</Card.Title> {/* Display user's username */}
						<Card.Text>
							This is your profile page. Here you can view and update your personal information.
						</Card.Text>
					</Card.Body>
				</Card>
			) : (
				// Display loading message if user data is still being fetched
				<p>Loading your profile...</p>
			)}
		</Container>
	);
};

export default ProfilePage;
