import { useEffect } from 'react';

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
			<h1>Dashboard Page</h1>
		</div>
	);
};

export default Dashboard;