import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Openweatherlayer from './openweatherlayer.jsx';

function Weathermap({ className, activeLayer, onMapLoad, centerLat, centerLng, onUserLocation }) {

	// useState hooks for geolocation
	const [userPos, setUserPos] = useState(null);
	const [geolocationError, setGeolocationError] = useState(null);

	const mapRef = useRef(null);

	// useEffect to fetch user's geolocation
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserPos({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					// store the latitude and longitude in local storage
					localStorage.setItem('latitude', position.coords.latitude);
					localStorage.setItem('longitude', position.coords.longitude);
					// update the user latitude and longitude of user
					if (onUserLocation) {
						onUserLocation(position.coords.latitude, position.coords.longitude);
					}
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

	// when parent provides centerLat/centerLng, center the map if available
	useEffect(() => {
		if (mapRef.current && centerLat != null && centerLng != null) {
			console.log(`[Weathermap] Moving map to: ${centerLat}, ${centerLng}`);
			try {
				mapRef.current.setCenter({ lat: Number(centerLat), lng: Number(centerLng) });
			} catch (e) {
				console.warn('[Weathermap] failed to set center:', e);
			}
		}
	}, [centerLat, centerLng]);

	return(
		<div className={className}>
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
					defaultCenter={userPos ?? { lat: 39.5, lng: -98.35 }}
					defaultZoom={userPos ? 6 : 4}
					mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
					disableDefaultUI={true}
					onLoad={(mapArg) => {
						const map = mapArg.map;
						if (map) {
							mapRef.current = map;
							if (onMapLoad) onMapLoad(mapArg);
						}
					}}
				>
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
	);
};

export default Weathermap;