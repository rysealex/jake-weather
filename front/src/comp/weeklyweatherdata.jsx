import { useState, useEffect } from 'react';

function Weeklyweatherdata() {

	// useState hooks for latitiude and longitude
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	// useEffect to get weather data based on latitude and longitude
	useEffect(() => {
		const fetchWeatherData = async () => {
			setLatitude(10);
			setLongitude(20);
			if (latitude && longitude) {
				// proceed to fetch weather data with API calls
				try {
					const response = await fetch('http://localhost:5000/api/weather-data', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						// body: JSON.stringify({ latitude, longitude }),
					});
					// check if the response is ok
					if (response.ok) {
						const data = await response.json();
						console.log('Weather Data:', data);
					} else {
						const errorData = await response.json();
						console.error('Error fetching weather data:', errorData);
					}
				} catch (error) {
					console.error('Error during fetching weather data:', error);
				}
			}
		};		
		
		fetchWeatherData();
	}, [latitude, longitude]);

	return(
		<div>
			<h1>Weekly Weather Data Component</h1>
		</div>
	);
};

export default Weeklyweatherdata;