import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import Openweatherlayer from './openweatherlayer.jsx';

// helper component to render inside the map
function MapController({ onMapLoad }) {
	const map = useMap();

	useEffect(() => {
		if (map) {
			console.log("REAL MAP INSTANCE:", map);
			onMapLoad(map);
	}
	}, [map]);

	return null;
}

function Weathermap({ className, activeLayer, onMapLoad, centerLat, centerLng, onUserLocation }) {

	// useState hooks for geolocation
	const [userPos, setUserPos] = useState(null);
	const [geolocationError, setGeolocationError] = useState(null);

	const mapRef = useRef(null);
	const lastCenterRef = useRef(null);

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
	// only update if the coordinates have actually changed to avoid jitter from user dragging
	// useEffect(() => {
	// 	if (mapRef.current && centerLat != null && centerLng != null) {
	// 		const newCenter = `${centerLat},${centerLng}`;
	// 		if (lastCenterRef.current !== newCenter) {
	// 			console.log(`[Weathermap] Moving map to: ${centerLat}, ${centerLng}`);
	// 			try {
	// 				mapRef.current.setCenter({ lat: Number(centerLat), lng: Number(centerLng) });
	// 				lastCenterRef.current = newCenter;
	// 			} catch (e) {
	// 				console.warn('[Weathermap] failed to set center:', e);
	// 			}
	// 		}
	// 	}
	// }, [centerLat, centerLng]);

	// calculate the effective center for the map
	const effectiveCenter = 
		(centerLat != null && centerLng != null)
			? { lat: Number(centerLat), lng: Number(centerLng) } // use search location if available
			: userPos ?? { lat: 39.5, lng: -98.35 }; // fall back to user or default

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
					defaultCenter={effectiveCenter}
					defaultZoom={userPos ? 8 : 4}
					mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
					disableDefaultUI={true}
					gestureHandling="auto"
					clickableIcons={false}
					draggable={true}
				>
					<MapController onMapLoad={onMapLoad} />
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