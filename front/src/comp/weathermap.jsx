import { useState, useEffect, act } from 'react';
import { APIProvider, Map, AdvancedMarker, MapControl, ControlPosition } from '@vis.gl/react-google-maps';
import Searchlocation from './searchlocation.jsx';
import Openweatherlayer from './openweatherlayer.jsx';
import Layerbuttons from './layerbuttons.jsx';

// define all weather layer options
const LAYER_OPTIONS = [
	{ key: 'none', name: 'Geographical' },
	{ key: 'wind_new', name: 'Wind Speed' },
	{ key: 'precipitation_new', name: 'Precipitation' },
	{ key: 'temp_new', name: 'Temperature' },
]

function Weathermap() {

	// useState hooks for geolocation
	const [userPos, setUserPos] = useState(null);
	const [geolocationError, setGeolocationError] = useState(null);

	// useState hook for active weather layer
	const [activeLayer, setActiveLayer] = useState(LAYER_OPTIONS[0].key);

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
				<APIProvider 
					apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					libraries={['places']}
				>
					<Map
						defaultCenter={userPos || mapPos}
						defaultZoom={15}
						mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
						disableDefaultUI={true}
					>
						<MapControl position={ControlPosition.TOP_RIGHT}>
							<Searchlocation />
						</MapControl>
						<MapControl position={ControlPosition.LEFT_TOP}>
							<Layerbuttons 
								options={LAYER_OPTIONS}
								activeLayer={activeLayer}
								onLayerSelect={setActiveLayer}
							/>
						</MapControl>
						{activeLayer !== 'none' && (
							<Openweatherlayer 
								layer={activeLayer}
							/>
						)}
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