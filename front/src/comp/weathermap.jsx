import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Openweatherlayer from './openweatherlayer.jsx';

function Weathermap({ className, activeLayer, onMapLoad, centerLat, centerLng }) {

	// useState hooks for geolocation
	const [userPos, setUserPos] = useState(null);
	const [geolocationError, setGeolocationError] = useState(null);

	// default map position (default to San Francisco)
	const mapPos = { lat: 37.7749, lng: -122.4194 }; 

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
					defaultCenter={userPos || mapPos}
					defaultZoom={15}
					mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
					disableDefaultUI={true}
					onLoad={(mapArg) => {
						const map = mapArg.map;
						if (map) {
							mapRef.current = map;
							if (onMapLoad) onMapLoad(mapArg);
						}
						// mapRef.current = map;
						// // apply initial center if provided
						// if (centerLat != null && centerLng != null) {
						// 	try { mapRef.current.setCenter({ lat: Number(centerLat), lng: Number(centerLng) }); } catch (e) {}
						// }
						// if (onMapLoad) onMapLoad(mapArg);
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