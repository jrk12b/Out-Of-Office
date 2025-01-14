import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { HOST } = require('../config.js');

const HeaderNavigation = ({ activeYear, setActiveYear, onLogout }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`${HOST}/api/auth/me`, {
					withCredentials: true,
				});
				setUser(response.data); // Update user state with data
			} catch (error) {
				console.error('Error fetching user data:', error);
				setUser(null); // Clear user state if not authenticated
				navigate('/login'); // Redirect to login if not authenticated
			}
		};

		fetchUserData();
	}, [navigate]); // Run only on component mount

	const handleLogout = async () => {
		try {
			await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
			setUser(null); // Clear user state after logout
			onLogout(); // Notify parent about logout
			navigate('/login'); // Redirect to login page
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand href="/">Out Of Office</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link onClick={() => setActiveYear('2024')} active={activeYear === '2024'}>
							2024
						</Nav.Link>
						<Nav.Link onClick={() => setActiveYear('2023')} active={activeYear === '2023'}>
							2023
						</Nav.Link>
						<Nav.Link onClick={() => setActiveYear('2022')} active={activeYear === '2022'}>
							2022
						</Nav.Link>
						<Nav.Link onClick={() => navigate('/map')}>Map</Nav.Link>
					</Nav>
					{user && (
						<>
							<Navbar.Text className="me-3">
								{user.username} ({user.userId})
							</Navbar.Text>
							<Button variant="danger" onClick={handleLogout}>
								Logout
							</Button>
						</>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default HeaderNavigation;
