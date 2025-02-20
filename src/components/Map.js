import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { HOST } = require('../config.js');

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
	const [pins, setPins] = useState([]);

	// Fetch pins from the backend when the component loads
	useEffect(() => {
		const fetchPins = async () => {
			try {
				const response = await fetch(`${HOST}/api/pins/user-pins`, {
					credentials: 'include', // Make sure cookies or tokens are sent
				});
				const data = await response.json();
				setPins(data);
			} catch (error) {
				console.error('Error fetching pins:', error);
			}
		};
		fetchPins();
	}, []);

	// Function to save a new pin to the backend
	const savePin = async (lat, lng, category) => {
		try {
			const response = await fetch(`${HOST}/api/pins/add`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ lat, lng, category }),
			});

			if (!response.ok) throw new Error('Failed to save pin');

			const newPin = await response.json();
			setPins([...pins, newPin]); // Update state with saved pin
		} catch (error) {
			console.error('Error saving pin:', error);
		}
	};

	const deletePin = async (id) => {
		try {
			const response = await fetch(`${HOST}/api/pins/delete/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!response.ok) throw new Error('Failed to delete pin');

			setPins(pins.filter((pin) => pin._id !== id));
		} catch (error) {
			console.error('Error deleting pin:', error);
		}
	};

	const visitedIcon = new L.Icon({
		iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
	});

	const wishlistIcon = new L.Icon({
		iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
	});

	const AddMarkerOnClick = () => {
		useMapEvents({
			click(e) {
				const { lat, lng } = e.latlng;
				const category = window.prompt('Enter category: visited or wishlist');
				if (category === 'visited' || category === 'wishlist') {
					savePin(lat, lng, category);
				} else {
					alert('Invalid category! Please enter "visited" or "wishlist".');
				}
			},
		});
		return null;
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
				<MapContainer
					center={[39.8283, -98.5795]}
					zoom={5}
					style={{ height: '100%', width: '100%' }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					<AddMarkerOnClick />
					{pins.map((pin) => (
						<Marker
							key={pin._id}
							position={[pin.lat, pin.lng]}
							icon={pin.category === 'visited' ? visitedIcon : wishlistIcon}
							å
						>
							<Popup>
								<div>
									<p>
										{pin.category === 'visited' ? 'Visited' : 'Wishlist'} <br />
										{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
									</p>
									<button
										onClick={() => deletePin(pin._id)}
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
			</div>
		</div>
	);
};

export default MapPage;
