import { useState, useEffect } from 'react';
import '../index.css';

function Weeklyweatherdata({ latitude, longitude }) {

	// useState hook for weekly weather data
	const [weeklyWeatherData, setWeeklyWeatherData] = useState([]);

	// useEffect to get weather data based on latitude and longitude
	useEffect(() => {
		const fetchWeatherData = async () => {

			if (latitude && longitude) {
				// proceed to fetch weather data with API calls
				try {
					const response = await fetch(`http://localhost:5000/api/weather-data/${latitude}/${longitude}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					// check if the response is ok
					if (response.ok) {
						const data = await response.json();
						setWeeklyWeatherData(data);
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
		<div className="locations">
			<div className="card"><h3>Mon</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Tue</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Wed</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Thu</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Fri</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Sat</h3><p>☀️ 1°C</p><small>Clear</small></div>
			<div className="card"><h3>Sun</h3><p>☀️ 1°C</p><small>Clear</small></div>
		</div>
	);
};

export default Weeklyweatherdata;