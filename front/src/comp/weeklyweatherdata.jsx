import { useState, useEffect } from 'react';
import '../index.css';

// helper function to map WMO weather codes to icon and description
const getWeatherIcon = (code) => {
	switch (true) {
		case code === 0:
			return { icon: '☀️', description: 'Clear sky' };
		case code >= 1 && code <= 3:
			return { icon: '☁️', description: 'Cloudy' };
		case code >= 45 && code <= 48:
			return { icon: '🌫️', description: 'Fog' };
		case code >= 51 && code <= 55:
			return { icon: '🌧️', description: 'Drizzle' };
		case code >= 61 && code <= 65:
			return { icon: '☔', description: 'Rain' };
		case code >= 71 && code <= 77:
			return { icon: '❄️', description: 'Snow' };
		case code >= 80 && code <= 82:
			return { icon: '💦', description: 'Rain showers' };
		case code >= 85 && code <= 86:
			return { icon: '🌨️', description: 'Snow showers' };
		case code >= 95 && code <= 99:
			return { icon: '⛈️', description: 'Thunderstorm' };
		default:
			return { icon: '❓', description: 'Unknown' }
	}
};

// helper function to format the date string into a short day name
const formatDay = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { weekday: 'short' });
};

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

	// ensure weekly array is present before map attempt
	const weeklyForecast = weeklyWeatherData?.weekly || [];

	return(
		<div className="locations">
			{weeklyForecast.length === 0 ? (
				<p>Loading weekly weather data...</p>
			) : (
				weeklyForecast.map((day, index) => {
					const { icon, description } = getWeatherIcon(day.weather_code);
					const dayName = formatDay(day.date);
					const temperature = Math.round(day.temperature_2m);

					return (
						<div key={index} className='card'>
							<h3>{dayName}</h3>
							<p>{icon} {temperature}°F</p>
							<small>{description}</small>
						</div>
					);
				})
			)}
		</div>
	);
};

export default Weeklyweatherdata;