import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { HOST } = require('../config.js');

const HeaderNavigation = ({ activeYear, setActiveYear, onLogout }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`${HOST}/api/auth/me`, { withCredentials: true });
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
				setUser(null);
				navigate('/login');
			}
		};
		fetchUserData();
	}, [navigate]);

	const handleLogout = async () => {
		try {
			await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
			setUser(null);
			onLogout();
			navigate('/login');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<Navbar bg="light" expand="lg" className="custom-navbar shadow-sm">
			<Container>
				<Navbar.Brand href="/" className="brand-text">
					Out Of Office
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{['2024', '2023', '2022'].map((year) => (
							<Nav.Link
								key={year}
								onClick={() => setActiveYear(year)}
								active={activeYear === year}
								className="year-link"
							>
								{year}
							</Nav.Link>
						))}
						<Nav.Link onClick={() => navigate('/map')} className="nav-item-link">
							Map
						</Nav.Link>
					</Nav>
					{user ? (
						<Dropdown align="end" className="user-dropdown">
							<Dropdown.Toggle variant="outline-primary" className="user-toggle">
								{user.username}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					) : null}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default HeaderNavigation;
