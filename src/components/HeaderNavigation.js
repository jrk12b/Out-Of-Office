import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const { HOST } = require('../config.js');

const HeaderNavigation = ({ activeYear, setActiveYear, onLogout, isLoggedIn }) => {
	const navigate = useNavigate(); // Using the navigate hook from react-router-dom to handle page navigation
	const [user, setUser] = useState(null); // State to store user data

	useEffect(() => {
		// Fetch user data when the component is mounted or when the login state changes
		const fetchUserData = async () => {
			if (!isLoggedIn) {
				// If the user is not logged in, set user to null
				setUser(null);
				return;
			}
			try {
				// Fetch user data from the backend
				const response = await axios.get(`${HOST}/api/auth/me`, { withCredentials: true });
				setUser(response.data); // Set the user data in state
			} catch (error) {
				console.error('Error fetching user data:', error.response?.data || error.message);
				setUser(null); // If there's an error, reset the user state to null
				// If the error occurs and the user is not on the register page, redirect to login
				if (window.location.pathname !== '/register') {
					navigate('/login');
				}
			}
		};

		fetchUserData(); // Call the fetchUserData function
	}, [isLoggedIn, navigate]); // Dependency array to re-run the effect when `isLoggedIn` or `navigate` changes

	const handleLogout = async () => {
		// Handle logout action
		try {
			await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true }); // Send a request to logout
			setUser(null); // Clear the user data from state
			onLogout(); // Call the passed in logout function
			navigate('/login'); // Redirect to the login page after logout
		} catch (error) {
			console.error('Error during logout:', error); // Log any errors during logout
		}
	};

	return (
		<Navbar bg="light" expand="lg" className="custom-navbar shadow-sm">
			{/* Navbar for the header */}
			<Container>
				{/* Navbar brand */}
				<Navbar.Brand href="/" className="brand-text">
					Out Of Office
				</Navbar.Brand>
				{/* Navbar toggle button for mobile view */}
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{/* Loop through years to create links for different active years */}
						{['2025', '2024', '2023', '2022'].map((year) => (
							<Nav.Link
								key={year} // Unique key for each year
								onClick={() => {
									setActiveYear(year); // Set the active year
									navigate('/'); // Navigate to the home page
								}}
								active={activeYear === year} // Highlight the active year link
								className="year-link"
							>
								{year}
							</Nav.Link>
						))}
						{/* Map link */}
						<Nav.Link onClick={() => navigate('/map')} className="nav-item-link">
							Map
						</Nav.Link>
					</Nav>
					{/* If user is logged in, show dropdown with user options */}
					{user ? (
						<Dropdown align="end" className="user-dropdown">
							<Dropdown.Toggle variant="outline-primary" className="user-toggle">
								{user.username} {/* Show the username */}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{/* Profile and logout options */}
								<Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					) : null}{' '}
					{/* If not logged in, do not show the dropdown */}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default HeaderNavigation; // Exporting the component for use in other parts of the app
