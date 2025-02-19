import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
	const [pins, setPins] = useState([]);

	// Custom hook to handle map clicks
	const AddMarkerOnClick = () => {
		useMapEvents({
			click(e) {
				const { lat, lng } = e.latlng;
				setPins([...pins, { lat, lng }]); // Add a new pin
			},
		});
		return null; // This component doesn't render anything
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
