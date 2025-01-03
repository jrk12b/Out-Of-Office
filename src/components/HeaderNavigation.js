import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeaderNavigation = ({ activeYear, setActiveYear, onLogout }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('http://localhost:8000/api/auth/me', {
					withCredentials: true,
				});
				setUser(response.data); // This will set the username and userId in state
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	const handleLogout = () => {
		// Call the onLogout function passed as a prop to reset the login state
		onLogout();

		// Optionally, redirect the user to the login page after logout
		navigate('/login');
	};

	return (
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand href="#home">Out Of Office</Navbar.Brand>
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
					</Nav>
					{/* Display user info */}
					{user && (
						<Navbar.Text className="me-3">
							<span>
								{user.username} ({user.userId})
							</span>
						</Navbar.Text>
					)}
					<Button variant="danger" onClick={handleLogout}>
						Logout
					</Button>{' '}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default HeaderNavigation;
