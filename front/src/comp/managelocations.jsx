import { useState, useRef } from 'react';
import Favlocations from '../comp/favlocations';

function Managelocations() {

	// useState hooks for manage locations inputs
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [zip, setZip] = useState('');

	// useState hooks for error handling
	const [cityError, setCityError] = useState('');
	const [stateError, setStateError] = useState('');
	const [countryError, setCountryError] = useState('');
	const [zipError, setZipError] = useState('');
	const [generalError, setGeneralError] = useState('');

	// useState hook for success message
	const [successMessage, setSuccessMessage] = useState('');

	// refs for manage locations input fields
	const cityInputRef = useRef(null);
	const stateInputRef = useRef(null);
	const countryInputRef = useRef(null);
	const zipInputRef = useRef(null);

	// regex to check for only letters and spaces
	const lettersOnlyRegex = /^[A-Za-z\s]+$/;

	// handle adding a new location
	const handleAddLocation = async (e) => {
		e.preventDefault();

		// clear previous errors and success message
		setCityError("");
		setStateError("");
		setCountryError("");
		setZipError("");
		setGeneralError("");
		setSuccessMessage("");

		// get the userid from local storage
		const userid = localStorage.getItem('userid');

		if (!userid) {
			// if no userid, navigate to login page
			console.log('No userid found');
			return;
		}

		let hasError = false;

		// provide input validation here
		if (!city) {
			setCityError('City is required');
			hasError = true;
			cityInputRef.current.focus();
		}
		else if (!lettersOnlyRegex.test(city)) {
			setCityError('City must contain only letters and spaces');
			hasError = true;
			cityInputRef.current.focus();
		}
		else if (!state) {
			setStateError('State is required');
			hasError = true;
			stateInputRef.current.focus();
		}
		else if (state.length !== 2) {
			setStateError('State must be 2 characters long');
			hasError = true;
			stateInputRef.current.focus();
		}
		else if (!country) {
			setCountryError('Country is required');
			hasError = true;
			countryInputRef.current.focus();
		}
		else if (!lettersOnlyRegex.test(country)) {
			setCountryError('Country must contain only letters and spaces');
			hasError = true;
			countryInputRef.current.focus();
		}
		else if (!zip) {
			setZipError('Zip is required');
			hasError = true;
			zipInputRef.current.focus();
		}
		else if (zip.length !== 5) {
			setZipError('Zip must be 5 characters long');
			hasError = true;
			zipInputRef.current.focus();
		}
		else if (isNaN(zip)) {
			setZipError('Zip must be a number');
			hasError = true;
			zipInputRef.current.focus();
		}
		if (hasError) {
			return; // stop if there are validation errors
		}

		// proceed to add location with API calls
		try {
			// step 1: get the latitude and longitude from the location data
			const latitude = 46.9965
			const longitude = -120.5478;

			// step 2: add the favorite location
			const favlocationResponse = await fetch(`http://localhost:5000/favlocations/add/${userid}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ latitude, longitude, city, state, country, zip }),
			});
			// check if response is ok
			if (favlocationResponse.ok) {
				setCity('');
				setState('');
				setCountry('');
				setZip('');
				// show success message for a short duration
				setSuccessMessage('Favorite location added successfully');
				setTimeout(() => {
					setSuccessMessage('');
				}, 4000);
				const favlocationData = await favlocationResponse.json();
				console.log('Favorite location added successfully:', favlocationData);
			} else {
				setCity('');
				setState('');
				setCountry('');
				setZip('');
				cityInputRef.current.focus();
				const errorData = await favlocationResponse.json();
				setGeneralError(errorData.error || 'Failed to add favorite location');
			}
		} catch (error) {
			setCity('');
			setState('');
			setCountry('');
			setZip('');
			cityInputRef.current.focus();
			setGeneralError('Error adding favorite location', error);
		}
	};

	// handle deleting a location
	const handleDeleteLocation = async (e) => {
		e.preventDefault();
		
		// get the locationid from the selected location
		const locationid = 3;

		// proceed to delete location with API calls
		try {
			const deleteResponse = await fetch(`http://localhost:5000/favlocations/delete/${locationid}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			// check if response is ok
			if (deleteResponse.ok) {
				// show success message for a short duration
				setSuccessMessage('Favorite location deleted successfully');
				setTimeout(() => {
					setSuccessMessage('');
				}, 4000);
				const deleteData = await deleteResponse.json();
				console.log('Favorite location deleted successfully:', deleteData);
			} else {
				const errorData = await deleteResponse.json();
				setGeneralError(errorData.error || 'Failed to delete favorite location');
			}
		} catch (error) {
			setGeneralError('Error deleting favorite location', error);
		}
	};

	return(
		<div>
			<h1>Manage Locations</h1>
			<Favlocations />
			<form onSubmit={handleAddLocation}>
				<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required ref={cityInputRef} />
				{cityError && <p className="error">{cityError}</p>}
				<input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required ref={stateInputRef} />
				{stateError && <p className="error">{stateError}</p>}
				<input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required ref={countryInputRef} />
				{countryError && <p className="error">{countryError}</p>}
				<input type="text" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} required ref={zipInputRef} />
				{zipError && <p className="error">{zipError}</p>}
				{generalError && <p className="error">{generalError}</p>}
				{successMessage && <p className="success">{successMessage}</p>}
				<button type="submit">Add Location</button>
				<button onClick={handleDeleteLocation}>Delete Location</button>
			</form>
		</div>
	);
};

export default Managelocations;