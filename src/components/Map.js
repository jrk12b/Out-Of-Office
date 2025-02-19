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
	const savePin = async (lat, lng) => {
		try {
			const response = await fetch(`${HOST}/api/pins/add`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Ensure user authentication is included
				body: JSON.stringify({ lat, lng }),
			});

			if (!response.ok) throw new Error('Failed to save pin');

			const newPin = await response.json();
			setPins([...pins, newPin]); // Update state with saved pin
		} catch (error) {
			console.error('Error saving pin:', error);
		}
	};

	// Custom hook to handle map clicks
	const AddMarkerOnClick = () => {
		useMapEvents({
			click(e) {
				const { lat, lng } = e.latlng;
				savePin(lat, lng); // Save pin to DB
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
					{pins.map((pin, index) => (
						<Marker key={index} position={[pin.lat, pin.lng]}>
							<Popup>
								A new pin at <br /> {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
							</Popup>
						</Marker>
					))}
				</MapContainer>
			</div>
		</div>
	);
};

export default MapPage;
