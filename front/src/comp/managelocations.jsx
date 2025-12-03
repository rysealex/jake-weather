import { useState, useRef, useEffect } from 'react';
import Favlocations from '../comp/favlocations';
import '../index.css';

function Managelocations({ isOpen, onClose, onRefresh }) {

	// maximum number of favorite locations
	const MAX_FAV_LOCATIONS = 10;

	// useState hook for current number of favorite locations
	const [currentFavCount, setCurrentFavCount] = useState(0);

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

	// useState to trigger a refresh in favlocation component
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// refs for manage locations input fields
	const cityInputRef = useRef(null);
	const stateInputRef = useRef(null);
	const zipInputRef = useRef(null);

	// regex to check for only letters and spaces
	const lettersOnlyRegex = /^[A-Za-z\s]+$/;

	// useEffect to clear the locationid from local storage on component mount
	useEffect(() => {
    localStorage.removeItem('locationid');

  }, []);

	// function to clear all the location inputsa and error/success messages
	const clearInputs = () => {
		setCity('');
		setState('');
		setZip('');
		setCityError('');
		setStateError('');
		setZipError('');
		setGeneralError('');
		setSuccessMessage('');
		// remove the locationid from local storage
		localStorage.removeItem('locationid');
	};

	// function to handle the close manage locations component modal
	const handleCloseModal = () => {
		clearInputs();
		onClose();
		// remove modal city from local storage
		localStorage.removeItem('modalCity');
	};

	// only render manage locations component if opened
	if (!isOpen) {
		return null; 
	}

	// function to get latitude and longitude using Google Geocoding API
	const getCoord = async (city, state, zip) => {
		if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
			throw new Error("Google Maps API key is missing or not configured correctly.");
		}

		// construct the address query string
		const address = `${city}, ${state}, ${zip}`;
		const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

		// attempt to get latitude and longitude
		try {
			const response = await fetch(geocodeUrl);
			const data = await response.json();
			// check if status is ok and latitude and longitude returned
			if (data.status === 'OK' && data.results.length > 0) {
				const location = data.results[0].geometry.location;
				console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
				return {
					latitude: location.lat,
					longitude: location.lng
				};
			} else {
				throw new Error(`Geocoding failed. Status: ${data.status}. Please check location details.`);
			}
		} catch (error) {
			throw new Error(`Network or Google Geocoding API error: ${error.message}`);
		};
	};

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

	// handle the save location action
	const handleSaveLocation = async (e) => {
		e.preventDefault();

		// get the locationid from local storage
    const locationid = localStorage.getItem('locationid');
    
    // check if user is editing (locationid is present) or adding a location (locationid not present)
    const isEditing = !!locationid;
    
    // clear previous errors and success message
    setCityError("");
    setStateError("");
    setZipError("");
    setGeneralError("");
    setSuccessMessage("");
    
    // get the userid from local storage
    const userid = localStorage.getItem('userid');

    if (isEditing) {
			// check if locationid found for editing
      if (!locationid) {
				setCityError("");
				setStateError("");
				setZipError("");
				cityInputRef.current.focus();
        setGeneralError('Error: Attempted to edit without a selected location ID');
        return; 
      }
    } else {
      // check if userid found for adding
      if (!userid) {
				setCityError("");
				setStateError("");
				setZipError("");
				cityInputRef.current.focus();
        setGeneralError('No userid found for adding location');
        return;
      }
			if (currentFavCount >= MAX_FAV_LOCATIONS) {
				setCityError("");
				setStateError("");
				setZipError("");
				cityInputRef.current.focus();
				setGeneralError(`Maximum of ${MAX_FAV_LOCATIONS} favorite locations reached`);
				return;
			}
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

    // determine which API URL and HTTP method to use
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing 
      ? `http://localhost:5000/favlocations/edit/${locationid}`
      : `http://localhost:5000/favlocations/add/${userid}`;

		// determine which success and error messages to display
    const successMsg = isEditing ? 'Favorite location edited successfully' : 'Favorite location added successfully';
    const erroreMsg = isEditing ? 'Failed to edit favorite location' : 'Failed to add favorite location';

    try {
			// get the latitude and longitude from Google Geocoding API
			const { latitude, longitude } = await getCoord(city, state, zip);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude, city, state, zip }),
      });
			// check if response is ok
      if (response.ok) {
        if (!isEditing) {
					setCity('');
					setState('');
					setZip('');
        }
				// trigger the refresh
				if (onRefresh) onRefresh();
				// trigger the favlocations component fetch refresh after successful add/edit
				setRefreshTrigger(prev => prev + 1);
				// show success message for a short duration
        setSuccessMessage(successMsg);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setCity('');
        setState('');
        setZip('');
        cityInputRef.current.focus();
        const errorData = await response.json();
        setGeneralError(errorData.error || erroreMsg);
      }
    } catch (error) {
      setCity('');
      setState('');
      setZip('');
      cityInputRef.current.focus();
			setGeneralError(`Operation failed: ${error.message}`);
      // setGeneralError(`Error ${isEditing ? 'editing' : 'adding'} favorite location: ${error.message}`);
    }
	};

	// handle deleting a location
	const handleDeleteLocation = async (e) => {
		e.preventDefault();
		
		// get the locationid from the selected location in local storage
		const locationid = localStorage.getItem('locationid');

		if (!locationid) {
			setGeneralError('Select a favorite location to delete');
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
				setCity('');
        setState('');
        setZip('');
				// trigger the refresh
				if (onRefresh) onRefresh();
				// trigger the favlocations component fetch refresh after successful delete
				setRefreshTrigger(prev => prev + 1);
				// remove locationid from local storage
				localStorage.removeItem('locationid');
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
		<div className="modal" id="modal">
			<div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="manageTitle">
				<div className="locations-list" id="locationList">
					<Favlocations onLocationSelect={handleLocationSelect} refreshTrigger={refreshTrigger} onFavCountUpdate={setCurrentFavCount} />
				</div>
				<div className="location-details">
					<div>
						<h3>Location Info</h3>
						<div className="info-group">
							<form onSubmit={handleSaveLocation}>
								<label htmlFor="cityInput">City:</label>
								<input id="cityInput" type="text" value={city} onChange={(e) => setCity(e.target.value)} required ref={cityInputRef} />
								{cityError && <p className='error-message'>{cityError}</p>}
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
								{stateError && <p className='error-message'>{stateError}</p>}
								<label htmlFor="zipInput">Zip:</label>
								<input id="zipInput" type="text" value={zip} onChange={(e) => setZip(e.target.value)} required ref={zipInputRef} />
								{zipError && <p className='error-message'>{zipError}</p>}
								{generalError && <p className='error-message'>{generalError}</p>}
								{successMessage && <p className="success-message">{successMessage}</p>}
								<div className="modal-footer">
									<button id="saveBtn" type="submit">Save</button>
									<button id="closeBtn" type="button" onClick={handleDeleteLocation}>Delete</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div 
					className="close-modal" 
					id="closeModalBtn"
					onClick={handleCloseModal}
				>
					x
				</div>
			</div>
		</div>
	);
};

export default Managelocations;