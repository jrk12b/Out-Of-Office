import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { HOST } = require('../config.js');

// Fixing default Leaflet marker icon URL paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
	const [pins, setPins] = useState([]); // State to store map pins

	// Fetch pins from backend API when the component loads
	useEffect(() => {
		const fetchPins = async () => {
			try {
				const response = await fetch(`${HOST}/api/pins/user-pins`, {
					credentials: 'include', // Include credentials like cookies or tokens in the request
				});
				const data = await response.json(); // Parse response JSON to get pins
				setPins(data); // Set pins to state
			} catch (error) {
				console.error('Error fetching pins:', error); // Log any errors
			}
		};
		fetchPins(); // Call the function to fetch pins
	}, []); // Empty dependency array means this runs once after the initial render

	// Function to save a new pin to the backend
	const savePin = async (lat, lng, category) => {
		try {
			const response = await fetch(`${HOST}/api/pins/add`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Include credentials in the request
				body: JSON.stringify({ lat, lng, category }), // Send lat, lng, and category in the request body
			});

			if (!response.ok) throw new Error('Failed to save pin'); // Check if the request was successful

			const newPin = await response.json(); // Parse the response to get the new pin data
			setPins([...pins, newPin]); // Add the new pin to the state
		} catch (error) {
			console.error('Error saving pin:', error); // Log any errors
		}
	};

	// Function to delete a pin from the backend
	const deletePin = async (id) => {
		try {
			const response = await fetch(`${HOST}/api/pins/delete/${id}`, {
				method: 'DELETE',
				credentials: 'include', // Include credentials in the request
			});

			if (!response.ok) throw new Error('Failed to delete pin'); // Check if the request was successful

			// Remove the deleted pin from the state
			setPins(pins.filter((pin) => pin._id !== id));
		} catch (error) {
			console.error('Error deleting pin:', error); // Log any errors
		}
	};

	// Custom icons for 'visited' and 'wishlist' categories
	const visitedIcon = new L.Icon({
		iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue dot for visited places
	});

	const wishlistIcon = new L.Icon({
		iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', // Green dot for wishlist places
	});

	// Component to add a marker on map click
	const AddMarkerOnClick = () => {
		useMapEvents({
			click(e) {
				const { lat, lng } = e.latlng; // Get latitude and longitude of the click event
				const category = window.prompt('Enter category: visited or wishlist'); // Prompt user for category
				if (category === 'visited' || category === 'wishlist') {
					savePin(lat, lng, category); // Save pin with the given category
				} else {
					alert('Invalid category! Please enter "visited" or "wishlist".'); // Handle invalid input
				}
			},
		});
		return null;
	};

	// Component to display the map legend
	const Legend = () => {
		return (
			<div
				style={{
					position: 'absolute',
					bottom: '20px',
					left: '20px',
					backgroundColor: 'white',
					padding: '10px',
					borderRadius: '5px',
					boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)', // Add a shadow for better visibility
					fontSize: '14px',
				}}
			>
				<p>
					<span style={{ color: 'blue', fontWeight: 'bold' }}>●</span> Visited
				</p>
				<p>
					<span style={{ color: 'green', fontWeight: 'bold' }}>●</span> Wishlist
				</p>
			</div>
		);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ height: '75vh', width: '75%' }}>
				{/* Rendering the map container */}
				<MapContainer
					center={[39.8283, -98.5795]} // Set the initial map center (USA coordinates)
					zoom={4} // Set the initial zoom level
					style={{ height: '100%', width: '100%' }} // Make the map take full available space
				>
					{/* Adding the OpenStreetMap tile layer */}
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					{/* Component to add marker on click */}
					<AddMarkerOnClick />
					{/* Render each pin as a Marker */}
					{pins.map((pin) => (
						<Marker
							key={pin._id} // Set the unique key for each marker
							position={[pin.lat, pin.lng]} // Set the marker position
							icon={pin.category === 'visited' ? visitedIcon : wishlistIcon} // Choose the icon based on category
						>
							<Popup>
								<div>
									<p>
										{pin.category === 'visited' ? 'Visited' : 'Wishlist'} <br />
										{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)} {/* Display coordinates */}
									</p>
									{/* Delete button for each pin */}
									<button
										onClick={() => deletePin(pin._id)} // Delete pin on click
										style={{
											backgroundColor: 'red',
											color: 'white',
											border: 'none',
											padding: '5px',
											cursor: 'pointer',
										}}
									>
										Delete
									</button>
								</div>
							</Popup>
						</Marker>
					))}
				</MapContainer>
				{/* Rendering the legend */}
				<Legend />
			</div>
		</div>
	);
};

export default MapPage;
