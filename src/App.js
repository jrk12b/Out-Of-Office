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

const { HOST } = require('./config.js');

const App = () => {
	const [activeYear, setActiveYear] = useState('2025');
	const [ptoList, setPtoList] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = async () => {
		setIsLoggedIn(true);
		localStorage.setItem('isLoggedIn', 'true');

		try {
			const response = await axios.get(`${HOST}/api/pto`, { withCredentials: true });
			setPtoList(response.data);
		} catch (error) {
			console.error('Error fetching PTO data after login:', error);
		}
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		localStorage.removeItem('isLoggedIn');
	};

	useEffect(() => {
		const loggedIn = localStorage.getItem('isLoggedIn');
		if (loggedIn === 'true') {
			setIsLoggedIn(true);
		}

		const fetchPTO = async () => {
			try {
				const response = await axios.get(`${HOST}/api/pto`, { withCredentials: true });
				setPtoList(response.data);
			} catch (error) {
				console.error('Error fetching PTO data:', error);
			}
		};

		fetchPTO();
	}, []);

	const addPTO = async (newPTO) => {
		try {
			const response = await axios.post(`${HOST}/api/pto`, newPTO, {
				withCredentials: true,
			});
			setPtoList((prev) => [...prev, response.data]);
		} catch (error) {
			console.error('Error adding PTO:', error);
		}
	};

	const deletePTO = async (id) => {
		try {
			const url = `${HOST}/api/pto/${id}`;
			await axios.delete(url);
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
				onLogout={handleLogout}
				isLoggedIn={isLoggedIn}
			/>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login onLogin={handleLogin} />} />
				<Route path="/map" element={<Map />} />
				<Route path="/profile" element={<Profile />} />
				<Route
					path="/"
					element={
						isLoggedIn ? (
							<>
								<PageContent
									activeYear={activeYear}
									ptoList={ptoList}
									totalPTO={18}
									addPTO={addPTO}
									deletePTO={deletePTO}
								/>
								<Calendar activeYear={activeYear} ptoList={ptoList} />{' '}
							</>
						) : (
							<div className="login-container">
								<div className="login-card">
									<h2>Please log in to access the app</h2>
									<Link to="/login">Go to Login</Link>
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
