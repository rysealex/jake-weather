import { useEffect } from 'react';
import '../index.css';

function Dashboard() {
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
	}, []);

	return(


		<div>

			{/* Top Bar */}
			<div class="top-bar">
				<div class="top-left">
					<div class="today-weather">
						Today’s Weather <span></span>
					</div>
						<div class="map-buttons">
						<button data-layer="geo" class="active">🗺️</button>
						<button data-layer="wind">🍃</button>
						<button data-layer="precip">🌧️</button>
						<button data-layer="temp">🌡️</button>
					</div>
				</div>

				<div class="global-search">
					<input type="text" id="searchInput" placeholder="Search Location"/>
					<button class="search-btn" id="searchBtn">🔍</button>
				</div>
			</div>

			{/* Main App */}
			<div class="weather-app">

				{/* SideBar */}
				<div class="sidebar">
					<div>
						<h2>Manage Locations</h2>
						<div class="menu">
							<button id="manageBtn"> Add/Remove </button>
						</div>
					</div>

					<div class="account">
						<div class="avatar"></div>
						<div class="account-info">
							<h4>John Doe</h4>
							<p>Account</p>
						</div>
					</div>
				</div>
				{/* SideBar */}

				{/* Main */}
				<div class="main">
					<div class="main-header">
					<h2>Weekly Weather</h2>
					<div class="favorites-wrapper">
						<div class="favorites-title">⭐ Favorited Locations</div>
						<div class="favorites" id="favorites"></div>
					</div>
					</div>

					<div class="locations">
					<div class="card"><h3>Mon</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Tue</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Wed</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Thu</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Fri</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Sat</h3><p>☀️ 1°C</p><small>Clear</small></div>
					<div class="card"><h3>Sun</h3><p>☀️ 1°C</p><small>Clear</small></div>
					</div>

					<div class="footer"> J.A.K.E Weather Dashboard </div>
				</div>
				{/* Main */}
			</div>
			{/* Main App */}

			{/* Modal (Manage Locations) */}
			<div class="modal" id="modal">
				<div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="manageTitle">
					<div class="locations-list" id="locationList">
						<h3 id="manageTitle">Added Locations</h3>
					</div>

					<div class="location-details">
						<div>
							<h3>Location Info</h3>
							<div class="info-group">
								<label for="cityInput">City:</label><input id="cityInput" type="text"/>
								<label for="stateInput">State:</label><input id="cityInput" type="text"/>
								<label for="streetInput">Country:</label><input id="cityInput" type="text"/>
								<label for="zipInput">Zip:</label><input id="cityInput" type="text"/>
							</div>
						</div>

						<div class="modal-footer">
							<button id="saveBtn">Save</button>
							<button id="closeBtn">Delete</button>
						</div>
					</div>

					<div class="close-modal" id="closeModalBtn">x</div>
				</div>
			</div>
			{/* Modal (Manage Locations)*/}
		</div>
	);
};

export default Dashboard;