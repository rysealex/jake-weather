import { useState, useEffect } from 'react';

function Favlocations() {

	// useState hook for favorite locations
	const [favlocations, setFavlocations] = useState([]);

	// useEffect to fetch favorite locations on component mount
	useEffect(() => {
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
				} else {
					const errorData = await response.json();
        	console.log('Favorite locations fetch failed:', errorData.error);
				}
			} catch (error) {
				console.error('Error fetching favorite locations:', error);
			}
		};

		fetchFavlocations();
	}, []);

  return(
		<div>Favlocations Component</div>
	);
};

export default Favlocations;