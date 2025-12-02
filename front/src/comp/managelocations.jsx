import { useState, useRef } from 'react';
import Favlocations from '../comp/favlocations';
import '../index.css';

function Managelocations() {

	// useState hooks for manage locations inputs
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	// useState hooks for error handling
	const [cityError, setCityError] = useState('');
	const [stateError, setStateError] = useState('');
	const [zipError, setZipError] = useState('');
	const [generalError, setGeneralError] = useState('');

	// useState hook for success message
	const [successMessage, setSuccessMessage] = useState('');

	// refs for manage locations input fields
	const cityInputRef = useRef(null);
	const stateInputRef = useRef(null);
	const zipInputRef = useRef(null);

	// regex to check for only letters and spaces
	const lettersOnlyRegex = /^[A-Za-z\s]+$/;

	// function to handle selected location from the favlocations component
	const handleLocationSelect = (location) => {
    // clear any previous errors on selection
    setCityError("");
    setStateError("");
    setZipError("");
    setGeneralError("");
    setSuccessMessage("");
    
    // update the managelocations state
    setCity(location.city);
    setState(location.state);
    setZip(location.zip);
    
    // store the selected locations locationid in local storage
    localStorage.setItem('locationid', location.locationid);
  };

	// handle adding a new location
	const handleAddLocation = async (e) => {
		e.preventDefault();

		// clear previous errors and success message
		setCityError("");
		setStateError("");
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
				body: JSON.stringify({ latitude, longitude, city, state, zip }),
			});
			// check if response is ok
			if (favlocationResponse.ok) {
				setCity('');
				setState('');
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
				setZip('');
				cityInputRef.current.focus();
				const errorData = await favlocationResponse.json();
				setGeneralError(errorData.error || 'Failed to add favorite location');
			}
		} catch (error) {
			setCity('');
			setState('');
			setZip('');
			cityInputRef.current.focus();
			setGeneralError('Error adding favorite location', error);
		}
	};

	// handle deleting a location
	const handleDeleteLocation = async (e) => {
		e.preventDefault();
		
		// get the locationid from the selected location in local storage
		const locationid = localStorage.getItem('locationid');

		if (!locationid) {
			setGeneralError('No location selected for deletion');
			return;
		}

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

	// handle editing a location
	const handleEditLocation = async (e) => {
		e.preventDefault();

		// clear previous errors and success message
		setCityError("");
		setStateError("");
		setZipError("");
		setGeneralError("");
		setSuccessMessage("");
		
		// get the locationid from the selected location in local storage
		const locationid = localStorage.getItem('locationid');

		if (!locationid) {
			setGeneralError('No location selected for deletion');
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

		// proceed to edit location with API calls
		try {
			// step 1: get the latitude and longitude from the location data
			const latitude = 30.2672;
			const longitude = 97.7431;

			// step 2: edit the favorite location
			const editResponse = await fetch(`http://localhost:5000/favlocations/edit/${locationid}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ latitude, longitude, city, state, zip }),
			});
			// check if response is ok
			if (editResponse.ok) {
				setCity('');
				setState('');
				setZip('');
				// show success message for a short duration
				setSuccessMessage('Favorite location edited successfully');
				setTimeout(() => {
					setSuccessMessage('');
				}, 4000);
				const editData = await editResponse.json();
				console.log('Favorite location edited successfully:', editData);
			} else {
				setCity('');
				setState('');
				setZip('');
				cityInputRef.current.focus();
				const errorData = await editResponse.json();
				setGeneralError(errorData.error || 'Failed to edit favorite location');
			}
		} catch (error) {
			setCity('');
			setState('');
			setZip('');
			cityInputRef.current.focus();
			setGeneralError('Error editing favorite location', error);
		}
	};

	return(
		<div className="modal" id="modal">
			<div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="manageTitle">
				<div className="locations-list" id="locationList">
					<h3 id="manageTitle">Added Locations</h3>
					<Favlocations onLocationSelect={handleLocationSelect} />
				</div>
				<div className="location-details">
					<div>
						<h3>Location Info</h3>
						<div className="info-group">
							<form onSubmit={handleAddLocation}>
								<label htmlFor="cityInput">City:</label>
								<input id="cityInput" type="text" value={city} onChange={(e) => setCity(e.target.value)} required ref={cityInputRef} />
								{cityError && <p className="error">{cityError}</p>}
								<label htmlFor="stateInput">State:</label>
								<select id="stateInput" value={state} onChange={(e) => setState(e.target.value)} required ref={stateInputRef} >
									<option value=""></option>
									<option value="AL">AL</option>
									<option value="AK">AK</option>
									<option value="AZ">AZ</option>
									<option value="AR">AR</option>
									<option value="CA">CA</option>
									<option value="CO">CO</option>
									<option value="CT">CT</option>
									<option value="DE">DE</option>
									<option value="FL">FL</option>
									<option value="GA">GA</option>
									<option value="HI">HI</option>
									<option value="ID">ID</option>
									<option value="IL">IL</option>
									<option value="IN">IN</option>
									<option value="IA">IA</option>
									<option value="KS">KS</option>
									<option value="KY">KY</option>
									<option value="LA">LA</option>
									<option value="ME">ME</option>
									<option value="MD">MD</option>
									<option value="MA">MA</option>
									<option value="MI">MI</option>
									<option value="MN">MN</option>
									<option value="MS">MS</option>
									<option value="MO">MO</option>
									<option value="MT">MT</option>
									<option value="NE">NE</option>
									<option value="NV">NV</option>
									<option value="NH">NH</option>
									<option value="NJ">NJ</option>
									<option value="NM">NM</option>
									<option value="NY">NY</option>
									<option value="NC">NC</option>
									<option value="ND">ND</option>
									<option value="OH">OH</option>
									<option value="OK">OK</option>
									<option value="OR">OR</option>
									<option value="PA">PA</option>
									<option value="RI">RI</option>
									<option value="SC">SC</option>
									<option value="SD">SD</option>
									<option value="TN">TN</option>
									<option value="TX">TX</option>
									<option value="UT">UT</option>
									<option value="VT">VT</option>
									<option value="VA">VA</option>
									<option value="WA">WA</option>
									<option value="WV">WV</option>
									<option value="WI">WI</option>
									<option value="WY">WY</option>
								</select>
								{stateError && <p className="error">{stateError}</p>}
								<label htmlFor="zipInput">Zip:</label>
								<input id="zipInput" type="text" value={zip} onChange={(e) => setZip(e.target.value)} required ref={zipInputRef} />
								{zipError && <p className="error">{zipError}</p>}
								{generalError && <p className="error">{generalError}</p>}
								{successMessage && <p className="success">{successMessage}</p>}
								<div className="modal-footer">
									<button id="saveBtn" type="submit">Save</button>
									<button id='saveBtn' onClick={handleEditLocation}>Edit</button>
									<button id="closeBtn" onClick={handleDeleteLocation}>Delete</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="close-modal" id="closeModalBtn">x</div>
			</div>
		</div>
	);
};

export default Managelocations;