import { useState, useEffect } from 'react';
import '../index.css';

function Favlocations({ onLocationSelect, refreshTrigger }) {

	// useState hook for favorite locations
	const [favlocations, setFavlocations] = useState([]);

	// useState hook for selected favorite location clicked
	const [selectedLocation, setSelectedLocation] = useState(null);

	// function to handle what happens when a favorite location button is clicked
  const handleLocationClick = (location) => {
		onLocationSelect(location);
		setSelectedLocation(location);
  };

	const fetchFavlocations = async () => {
		// get the userid from local storage
		const userid = localStorage.getItem('userid');

		if (!userid) {
			// if no userid, navigate to login page
			console.log('No userid found');
			return;
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
				console.log('Favorite locations:', favlocationsData);
				setFavlocations(favlocationsData);
			} else {
				const errorData = await response.json();
				console.log('Favorite locations fetch failed:', errorData.error);
			}
		} catch (error) {
			console.error('Error fetching favorite locations:', error);
		}
	};

	// useEffect to fetch favorite locations on component mount
	useEffect(() => {
		fetchFavlocations();

	}, [refreshTrigger]); // hook runs whenever refreshTrigger changes

  return(
		<div className="favorites-wrapper">
			<div className="favorites-title">⭐ Favorited Locations</div>
				<div className="favorites" id="favorites">
					<div className="favorites" id="favorites">
					{favlocations.length > 0 ? (
						favlocations.map((location) => (
							<button 
								key={location.locationid}
								className={selectedLocation && selectedLocation.locationid === location.locationid ? "favorite-item selected" : "favorite-item"}
								onClick={() => handleLocationClick(location)}
							>
								{location.city}, {location.state}
							</button>
						))
					) : (
						<p>No favorite locations saved</p>
					)}
				</div>
			</div> 
		</div>
	);
};

export default Favlocations;