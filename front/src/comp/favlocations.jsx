import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Favlocations({ onLocationSelect, refreshTrigger, onFavCountUpdate, clearSelectionTrigger }) {
	const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

	// useState hook for favorite locations
	const [favlocations, setFavlocations] = useState([]);

	// useState hook for selected favorite location clicked
	const [selectedLocation, setSelectedLocation] = useState(null);

	// function to handle what happens when a favorite location button is clicked
  const handleLocationClick = (location) => {
		setSelectedLocation(location);
		// store the selected location latitude, longitude, city, and modal city in local storage
		localStorage.setItem('latitude', location.latitude);
		localStorage.setItem('longitude', location.longitude);
		localStorage.setItem('selectedCity', location.city);
		localStorage.setItem('modalCity', location.city);
		// udpate the location selected
		if (onLocationSelect) {
			onLocationSelect(location);
		}
  };

	const fetchFavlocations = async () => {
		// get the userid from local storage
		const userid = localStorage.getItem('userid');

		if (!userid) {
			// if no userid, navigate to login page
			handleNavigate('/');
		}

		// proceed to fetch favorite locations with API calls
		try {
			const response = await fetch(`http://localhost:5000/favlocations/${userid}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			// check if the response is ok
			if (response.ok) {
				const favlocationsData = await response.json();
				// mark the first favorite location as the hometown location
				const favlocationsWithHometown = favlocationsData.map((location, index) => ({
					...location,
					isHometown: index === 0,
				}));
				setFavlocations(favlocationsWithHometown);
				// update the current number of favorite locations
				if (onFavCountUpdate) {
          onFavCountUpdate(favlocationsWithHometown.length);
        }
			} else {
				const errorData = await response.json();
				alert('Favorite locations fetch failed:', errorData.error);
			}
		} catch (error) {
			alert('Error fetching favorite locations:', error);
		}
	};

	// useEffect to fetch favorite locations
	useEffect(() => {
		fetchFavlocations();

	}, [refreshTrigger]); // hook runs whenever refreshTrigger changes

	useEffect(() => {
		// reset selected location in local storage on component mount
		setSelectedLocation(null);
    localStorage.removeItem('selectedCity');

	}, []);

	useEffect(() => {
		// un-select the currently selected location on search location trigger
		setSelectedLocation(null);
		// remove the locationid from local storage
		localStorage.removeItem('locationid');

	}, [clearSelectionTrigger]);

  return(
		<div className="favorites-wrapper">
			<div className="favorites-title"><h2>⭐ Favorite Locations</h2></div>
				<div className="favorites" id="favorites">
				{favlocations.length > 0 ? (
					favlocations.map((location) => (
						<button 
							key={location.locationid}
							className={selectedLocation && selectedLocation.locationid === location.locationid ? "favorite-item selected" : "favorite-item"}
							onClick={() => handleLocationClick(location)}
						>
							{location.city}, {location.state}
							{location.isHometown && <span className="hometown-location-span">Hometown Location</span>}
						</button>
					))
				) : (
					<p>No favorite locations saved</p>
				)}
			</div>
		</div>
	);
};

export default Favlocations;