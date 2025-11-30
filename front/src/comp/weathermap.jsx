import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

function Weathermap() {

	// useState hooks for geolocation
	const [userPos, setUserPos] = useState(null);
	const [geolocationError, setGeolocationError] = useState(null);

	// default map position (default to San Francisco)
	const mapPos = { lat: 37.7749, lng: -122.4194 }; 

	// useEffect to fetch user's geolocation
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserPos({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(error) => {
					setGeolocationError(error.message);
				},
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		} else {
			setGeolocationError('Geolocation is not supported by this browser');
		}
	}, []);

	return(
		<div>
			<h1>Weather Map Component</h1>
			<div style={{ height: '850px', width: '70%', margin: ' auto' }}>
				{geolocationError && (
					<div style={{ color: 'red' }}>
						Error fetching geolocation: {geolocationError}
					</div>
				)}
				<APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
					<Map
						defaultCenter={userPos || mapPos}
						defaultZoom={15}
						mapId={process.env.GOOGLE_MAPS_MAP_ID}
					>
						{userPos && (
							<AdvancedMarker
								position={userPos}
								title="Your Current Location"
							>
								<div className="user-location-dot" />
							</AdvancedMarker>
						)}
					</Map>
				</APIProvider>
			</div>
		</div>
	);
};

export default Weathermap;