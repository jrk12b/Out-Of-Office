import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import HeaderNavigation from './components/HeaderNavigation';
import PageHeader from './components/PageHeader';
import PageContent from './components/PageContent';
import Map from './components/Map';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

const App = () => {
	const [activeYear, setActiveYear] = useState('2024');
	const [ptoList, setPtoList] = useState([]);
	const calendarRef = useRef(null);
	const totalPTO = 18;
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Function to handle login state change
	const handleLogin = async () => {
		setIsLoggedIn(true);
		localStorage.setItem('isLoggedIn', 'true'); // Store login state in localStorage

		// Fetch PTO data immediately after logging in
		try {
			const response = await axios.get('http://localhost:8000/api/pto', { withCredentials: true });
			setPtoList(response.data);
		} catch (error) {
			console.error('Error fetching PTO data after login:', error);
		}
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		localStorage.removeItem('isLoggedIn'); // Remove login state from localStorage
	};

	useEffect(() => {
		// Check if the user is already logged in when the app is loaded or refreshed
		const loggedIn = localStorage.getItem('isLoggedIn');
		if (loggedIn === 'true') {
			setIsLoggedIn(true);
		}

		const fetchPTO = async () => {
			try {
				const response = await axios.get('http://localhost:8000/api/pto', {
					withCredentials: true,
				});
				setPtoList(response.data);
			} catch (error) {
				console.error('Error fetching PTO data:', error);
			}
		};

		fetchPTO();
	}, []);

	useEffect(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(`${activeYear}-01-01`);
		}
	}, [activeYear]);

	const calendarEvents = ptoList
		.filter((pto) => pto.date.startsWith(activeYear))
		.map((pto) => ({
			title: pto.name,
			date: pto.date,
			color: '#FF5733',
		}));

	const addPTO = async (newPTO) => {
		try {
			const response = await axios.post('http://localhost:8000/api/pto', newPTO, {
				withCredentials: true,
			});
			setPtoList((prev) => [...prev, response.data]);
		} catch (error) {
			console.error('Error adding PTO:', error);
		}
	};

	const deletePTO = async (id) => {
		try {
			await axios.delete(`http://localhost:8000/api/pto/${id}`);
			setPtoList((prev) => prev.filter((pto) => pto._id !== id));
		} catch (error) {
			console.error('Error deleting PTO:', error);
		}
	};

	return (
		<Router>
			<HeaderNavigation
				activeYear={activeYear}
				setActiveYear={setActiveYear}
				onLogout={handleLogout} // Pass handleLogout to HeaderNavigation
			/>
			<PageHeader activeYear={activeYear} />
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login onLogin={handleLogin} />} />
				<Route path="/map" element={<Map />} />
				<Route
					path="/"
					element={
						isLoggedIn ? (
							<>
								<PageContent
									activeYear={activeYear}
									ptoList={ptoList}
									totalPTO={totalPTO}
									addPTO={addPTO}
									deletePTO={deletePTO}
								/>
								<div className="calendar-container">
									<FullCalendar
										ref={calendarRef}
										plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
										initialView="multiMonthYear"
										initialDate={`${activeYear}-01-01`}
										editable={true}
										events={calendarEvents}
										timeZone="UTC"
										height="auto"
									/>
								</div>
							</>
						) : (
							<div>
								<h2>Please log in to access the app</h2>
								<Link to="/login">Go to Login</Link>
							</div>
						)
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
