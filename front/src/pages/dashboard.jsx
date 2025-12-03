import { useEffect, useState } from 'react';
import Managelocations from '../comp/managelocations';
import Weathermap from '../comp/weathermap';
import Weeklyweatherdata from '../comp/weeklyweatherdata';
import Favlocations from '../comp/favlocations';
import Layerbuttons from '../comp/layerbuttons';
import Searchlocation from '../comp/searchlocation';
import '../index.css';
import jakeLogo from '../jake-logo.png';

// define all weather layer options
const LAYER_OPTIONS = [
	{ key: 'none', name: 'Geographical', icon: '🗺️' },
	{ key: 'wind_new', name: 'Wind Speed', icon: '🍃' },
	{ key: 'precipitation_new', name: 'Precipitation', icon: '🌧️' },
	{ key: 'temp_new', name: 'Temperature', icon: '🌡️' },
]

function Dashboard() {

	// useState hook for user information
	const [userInfo, setUserInfo] = useState([]);

	// useState hooks for latitude, longitude, current day weather icon, and selected city
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [currentDayWeatherIcon, setCurrentDayWeatherIcon] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);

	// useState hooks for toggling manage locations component modal
	const [isManageLocationsOpen, setIsManageLocationsOpen] = useState(false);

	// useState hook for active weather layer
	const [activeLayer, setActiveLayer] = useState(LAYER_OPTIONS[0].key);

	// useState hook to hold the map instance
  const [mapInstance, setMapInstance] = useState(null);

	// function to capture the map instance
	const handleMapLoad = (mapArg) => {
		const map = mapArg && mapArg.map ? mapArg.map : mapArg;
		setMapInstance(map);
	};

	// function to flip manage locations component modal
	const toggleManageLocations = () => {
		setIsManageLocationsOpen(prev => !prev);
	};
	
	// useEffect to fetch user data on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			// get the userid from local storage
			const userid = localStorage.getItem('userid');
			
			if (!userid) {
				// if no userid, navigate to login page
				console.log('No userid found');
				return;
			}
			// proceed to fetch user data with API calls
			try {
				const response = await fetch(`http://localhost:5000/user/${userid}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				// check if the response is ok
				if (response.ok) {
					const userData = await response.json();
					console.log('User data:', userData);
					setUserInfo(userData);
				} else {
					const errorData = await response.json();
					console.log('User data fetch failed:', errorData.error);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}

		};
		fetchUserData();
		// get the latitude and longitude from local storage (convert to numbers when present)
		const storedLat = localStorage.getItem('latitude');
		const storedLng = localStorage.getItem('longitude');
		if (storedLat) setLatitude(Number(storedLat));
		if (storedLng) setLongitude(Number(storedLng));
		// get the current day weather icon from local storage
		const storedCurrentDayWeatherIcon = localStorage.getItem('currentDayWeatherIcon');
		if (storedCurrentDayWeatherIcon) setCurrentDayWeatherIcon(storedCurrentDayWeatherIcon);
		// get the selected city from local storage
		const storedSelectedCity = localStorage.getItem('selectedCity');
		if (storedSelectedCity) setSelectedCity(storedSelectedCity);
	}, []);

	return(
		<div className="dashboard-container">
			<Weathermap 
				className="full-screen-map" 
				activeLayer={activeLayer}
				onMapLoad={handleMapLoad}
				centerLat={latitude}
				centerLng={longitude}
			/>
			<div className="top-bar">
				<div className="top-left">
					<div className="today-weather">
						{currentDayWeatherIcon && (
							<span>{currentDayWeatherIcon}</span>
						)}
						{selectedCity ? `Today’s Weather - ${selectedCity}` : "Today's Weather" }
					</div>
					<Layerbuttons 
						options={LAYER_OPTIONS}
						activeLayer={activeLayer}
						onLayerSelect={setActiveLayer}
					/>
				</div>
				<Searchlocation 
					map={mapInstance} 
					onSelectLocation={(lat, lng) => {
						setLatitude(lat);
						setLongitude(lng);
						localStorage.setItem('latitude', lat);
						localStorage.setItem('longitude', lng);
					}}
				/>
			</div>

			{/* Main App */}
			<div className="weather-app">

				{/* SideBar */}
				<div className="sidebar">
					<div>
						<h2>Manage Locations</h2>
						<div className="menu">
							<button 
								id="manageBtn" 
								onClick={toggleManageLocations}
							> 
								Add/Remove 
							</button>
						</div>
					</div>

					<div className="account">
						<img src={jakeLogo} alt='jake-logo' className="avatar" />
						<div className="account-info">
							{userInfo ? (
								<h4>{userInfo.fname} {userInfo.lname}</h4>
							) : (
								<h4>Unable to fetch user data</h4>
							)}
							<p>Account</p>
						</div>
					</div>
				</div>
				{/* SideBar */}

				{/* Main */}
				<div className="main">
					<div className="main-header">
						<h2>Weekly Weather</h2>
					</div>
					<div className='main-content-row'>
						{latitude && longitude && <Weeklyweatherdata latitude={latitude} longitude={longitude} onIconUpdate={setCurrentDayWeatherIcon} onCityUpdate={setSelectedCity} />}
						<Favlocations />
					</div>
					<div className="footer">J.A.K.E Weather Dashboard</div>
				</div>
				{/* Main */}
			</div>
			{/* Main App */}

			{/* Modal (Manage Locations) */}
			<Managelocations 
				isOpen={isManageLocationsOpen}
				onClose={toggleManageLocations} 
			/>
		</div>
	);
};

export default Dashboard;