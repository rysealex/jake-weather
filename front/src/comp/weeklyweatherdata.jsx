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

// helper function to fetch the city name from latitude and longitude using Google Geocoding API
const fetchCity = async (latitude, longitude) => {
	if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) return "API Key Failed";
	try {
		const result = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
		);

		const data = await result.json();
		if (!data.results || data.results.length === 0) return "Unknown Location";

		const components = data.results[0].address_components;
		// fetch city details from components
		const city = 
			components.find(c => c.types.includes("locality"))?.long_name ||
			components.find(c => c.types.includes("administrative_area_level_2"))?.long_name ||
			components.find(c => c.types.includes("postal_town"))?.long_name ||
			"Unknown City";

		return city;
	} catch(error) {
		console.error("Error fetching city from Google Geoding API:", error);
		return "Unknown Location";
	}
};

function Weeklyweatherdata({ latitude, longitude, onIconUpdate, onCityUpdate }) {

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
						// store current day weather icon in local storage
						const currentDayWeather = data?.weekly?.[0];
						if (currentDayWeather) {
							const { icon } = getWeatherIcon(currentDayWeather.weather_code);
							localStorage.setItem('currentDayWeatherIcon', icon);
							if (onIconUpdate) onIconUpdate(icon);
						}
						// fetch the selected city from latitude and longitude and store in local storage
						const selectedCity = await fetchCity(latitude, longitude);
						localStorage.setItem('selectedCity', selectedCity);
						if (onCityUpdate) onCityUpdate(selectedCity);
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
				<p>Loading weekly weather...</p>
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