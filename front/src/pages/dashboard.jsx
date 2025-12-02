import { useEffect, useState } from 'react';
import Managelocations from '../comp/managelocations';
import Weathermap from '../comp/weathermap';
import Weeklyweatherdata from '../comp/weeklyweatherdata';
import Favlocations from '../comp/favlocations';
import Layerbuttons from '../comp/layerbuttons';
import Searchlocation from '../comp/searchlocation';
import '../index.css';

function Dashboard() {

	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	

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
				} else {
					const errorData = await response.json();
        			console.log('User data fetch failed:', errorData.error);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}

		};

		fetchUserData();


		setLatitude(localStorage.getItem('latitude'));
		setLongitude(localStorage.getItem('longitude'));
	}, []);

	return(
		<div>
			<div className="top-bar">
				<div className="top-left">
					<div className="today-weather">
						Today’s Weather <span></span>
					</div>
				</div>
			</div>

			{/* Main App */}
			<div className="weather-app">
				<Weathermap />
				{/* SideBar */}
				<div className="sidebar">
					<div>
						<h2>Manage Locations</h2>
						<div className="menu">
							<button id="manageBtn"> Add/Remove </button>
						</div>
					</div>

					<div className="account">
						<div className="avatar"></div>
						<div className="account-info">
							<h4>John Doe</h4>
							<p>Account</p>
						</div>
					</div>
				</div>
				{/* SideBar */}

				{/* Main */}
				<div className="main">
					<div className="main-header">
						<h2>Weekly Weather</h2>
						<Favlocations />
					</div>
					{latitude && longitude && <Weeklyweatherdata latitude={latitude} longitude={longitude}  />}
					<div className="footer"> J.A.K.E Weather Dashboard </div>
				</div>
				{/* Main */}
			</div>
			{/* Main App */}

			{/* Modal (Manage Locations) */}
			<Managelocations />
		</div>
	);
};

export default Dashboard;