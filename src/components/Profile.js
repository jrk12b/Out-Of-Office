import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import axios from 'axios';

const { HOST } = require('../config.js');

const ProfilePage = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`${HOST}/api/auth/me`, { withCredentials: true });
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error.response?.data || error.message);
				setUser(null); // Reset user if there's an error
			}
		};

		fetchUserData();
	}, []);

	return (
		<Container className="mt-5">
			{user ? (
				<Card className="shadow-sm">
					<Card.Body>
						<Card.Title>Welcome, {user.username}!</Card.Title>
						<Card.Text>
							This is your profile page. Here you can view and update your personal information.
						</Card.Text>
					</Card.Body>
				</Card>
			) : (
				<p>Loading your profile...</p>
			)}
		</Container>
	);
};

export default ProfilePage;
