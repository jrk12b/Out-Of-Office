import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import HeaderNavigation from './components/HeaderNavigation';
import PageContent from './components/PageContent';
import Map from './components/Map';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Calendar from './components/Calendar';
import './App.css';

const { HOST } = require('./config.js'); // Import the backend host URL from the config file

const App = () => {
	// State to track the active year and the list of PTO (Paid Time Off) entries
	const [activeYear, setActiveYear] = useState('2025');
	const [ptoList, setPtoList] = useState([]);
	// State to track if the user is logged in or not
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Function to handle login
	const handleLogin = async () => {
		setIsLoggedIn(true); // Set login state to true
		localStorage.setItem('isLoggedIn', 'true'); // Store login status in localStorage

		// Fetch PTO data after successful login
		try {
			const response = await axios.get(`${HOST}/api/pto`, { withCredentials: true });
			setPtoList(response.data); // Update the PTO list state with fetched data
		} catch (error) {
			console.error('Error fetching PTO data after login:', error); // Handle any error
		}
	};

	// Function to handle logout
	const handleLogout = () => {
		setIsLoggedIn(false); // Set login state to false
		localStorage.removeItem('isLoggedIn'); // Remove login status from localStorage
	};

	// useEffect hook for checking login status on component mount
	useEffect(() => {
		const loggedIn = localStorage.getItem('isLoggedIn'); // Get login status from localStorage
		if (loggedIn === 'true') {
			setIsLoggedIn(true); // If logged in, update the state
		}

		// Function to fetch PTO data on component mount
		const fetchPTO = async () => {
			try {
				const response = await axios.get(`${HOST}/api/pto`, { withCredentials: true });
				setPtoList(response.data); // Set PTO data to state
			} catch (error) {
				console.error('Error fetching PTO data:', error); // Handle error
			}
		};

		fetchPTO(); // Call fetchPTO function
	}, []); // Empty dependency array to run only once on mount

	// Function to add new PTO entry
	const addPTO = async (newPTO) => {
		try {
			// Post new PTO data to the backend
			const response = await axios.post(`${HOST}/api/pto`, newPTO, { withCredentials: true });
			// Add the new PTO entry to the existing list
			setPtoList((prev) => [...prev, response.data]);
		} catch (error) {
			console.error('Error adding PTO:', error); // Handle error
		}
	};

	// Function to delete a PTO entry by its ID
	const deletePTO = async (id) => {
		try {
			const url = `${HOST}/api/pto/${id}`; // Construct the URL to delete the PTO
			await axios.delete(url); // Send delete request to the backend
			// Remove the deleted PTO entry from the list
			setPtoList((prev) => prev.filter((pto) => pto._id !== id));
		} catch (error) {
			console.error('Error deleting PTO:', error); // Handle error
		}
	};

	// Main component JSX
	return (
		<Router>
			{/* Header navigation component, passing necessary props */}
			<HeaderNavigation
				activeYear={activeYear}
				setActiveYear={setActiveYear}
				onLogout={handleLogout}
				isLoggedIn={isLoggedIn}
			/>
			{/* Define routes and conditional rendering based on login status */}
			<Routes>
				{/* Register route */}
				<Route path="/register" element={<Register />} />
				{/* Login route with login handler */}
				<Route path="/login" element={<Login onLogin={handleLogin} />} />
				{/* Map route */}
				<Route path="/map" element={<Map />} />
				{/* Profile route */}
				<Route path="/profile" element={<Profile />} />
				{/* Home route (main page) */}
				<Route
					path="/"
					element={
						// Conditionally render content based on login status
						isLoggedIn ? (
							<>
								{/* Main page content */}
								<PageContent
									activeYear={activeYear}
									ptoList={ptoList}
									totalPTO={18} // Static total PTO value
									addPTO={addPTO}
									deletePTO={deletePTO}
									setPtoList={setPtoList}
								/>
								{/* Calendar component */}
								<Calendar activeYear={activeYear} ptoList={ptoList} />
							</>
						) : (
							// If not logged in, display login prompt
							<div className="login-container">
								<div className="login-card">
									<h2>Please log in to access the app</h2>
									<Link to="/login">Go to Login</Link> {/* Link to login page */}
								</div>
							</div>
						)
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
