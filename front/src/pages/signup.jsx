import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
	const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

	// useState hooks for signup form fields
	const [username, setUsername] = useState('');
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	// useState hooks for password and confirm password visibility
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

	// useState hooks for error handling
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [generalError, setGeneralError] = useState('');

	// useState hook for success message
	const [successMessage, setSuccessMessage] = useState('');

	// refs for login input fields
	const fnameInputRef = useRef(null);
	const usernameInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const confirmPasswordInputRef = useRef(null);
	const stateInputRef = useRef(null);
	const zipInputRef = useRef(null);

	// password complexity regex
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).*$/;

	// functions to toggle password and confirm password visibility
	const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

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

	// function to delete a user
	const deleteUser = async (userid) => {
		try {
			const deleteResponse = await fetch(`http://localhost:5000/user/delete/${userid}`, {
				method: 'DELETE',
			});
			// check if delete response is not ok (failed to delete user)
			if (!deleteResponse.ok) {
				alert("CRITICAL ERROR: Failed to rollback user");
			}
		} catch (deleteError) {
			alert("CRITICAL ERROR: Failed to rollback user: ", deleteError);
		}
	};

	// handle the signup attempt
  const handleSubmit = async (e) => {
    e.preventDefault();

		// clear previous errors and success message
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");
    setSuccessMessage("");

		let hasError = false;

		// provide input validation here
		if (!username) {
			setUsernameError('Username is required');
			hasError = true;
			usernameInputRef.current.focus();
		}
		else if (username.length < 5) {
			setUsernameError('Username must be at least 5 characters long');
			hasError = true;
			usernameInputRef.current.focus();
		}
		else if (username.length > 40) {
			setUsernameError('Username must be at most 40 characters long');
			hasError = true;
			usernameInputRef.current.focus();
		}
		else if (!password) {
			setPasswordError('Password is required');
			hasError = true;
			passwordInputRef.current.focus();
		}
		else if (password.length < 5) {
			setPasswordError('Password must be at least 5 characters long');
			hasError = true;
			passwordInputRef.current.focus();
		}
		else if (password.length > 20) {
			setPasswordError('Password must be at most 20 characters long');
			hasError = true;
			passwordInputRef.current.focus();
		}
		else if (passwordRegex.test(password) === false) {
			setPasswordError('Password must contain at least one special character, one capital letter, and one number');
			hasError = true;
			passwordInputRef.current.focus();
		}
		else if (password !== confirmPassword) {
			setConfirmPasswordError('Password and Confirm Password do not match');
			hasError = true;
			confirmPasswordInputRef.current.focus();
		}
		else if (!fname || !lname || !email || !city || !state || !zip) {
			setGeneralError('All fields are required');
			hasError = true;
		}
		else if (fname > 45 || lname > 45 || email > 45 || city > 45) { 
			setGeneralError('Input fields must be at most 45 characters long');
			hasError = true;
		}
		else if (state.length !== 2) {
			setGeneralError('State must be a 2-letter abbreviation');
			stateInputRef.current.focus();
			hasError = true;
		}
		else if (zip.length !== 5 || isNaN(zip)) {
			setGeneralError('Zip must be a 5-digit number');
			zipInputRef.current.focus();
			hasError = true;
		}
		if (hasError) {
			return; // stop if there are validation errors
		}

    // proceed to signup with API calls
    try {
			// step 1: check if the user already exists
			const existsResponse = await fetch(`http://localhost:5000/user/exists/${username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const existsData = await existsResponse.json();
			// check if user exists
			if (existsData.exists) {
				setUsername("");
				setFname("");
				setLname("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				setCity("");
				setState("");
				setZip("");
				fnameInputRef.current.focus();
				setGeneralError('User account already exists');
				return;
			}

			// step 2: create the user
      const userResponse = await fetch('http://localhost:5000/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, fname, lname, email, password, city, state, zip }),
      });
      // check if the user response is not ok
      if (!userResponse.ok) {
				setUsername("");
				setFname("");
				setLname("");
				setEmail("");
        setPassword("");
				setConfirmPassword("");
				setCity("");
				setState("");
				setZip("");
				fnameInputRef.current.focus();
        const errorData = await userResponse.json();
        setGeneralError(errorData.error || 'Failed to add user');
				return;
      }
			
			// if the user response is ok, then get the userid
			const userData = await userResponse.json();
			const userid = userData.userid;

			// step 3: add home location to favorite locations
			// check if userid is found
			if (!userid) {
				setUsername("");
				setFname("");
				setLname("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				setCity("");
				setState("");
				setZip("");
				fnameInputRef.current.focus();
        setGeneralError('Failed to add hometown location');
				return;
			}

			try {
				// get the latitude and longitude from Google Geocoding API
				const { latitude, longitude } = await getCoord(city, state, zip);

				const favLocationsResponse = await fetch(`http://localhost:5000/favlocations/add/${userid}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ latitude, longitude, city, state, zip }),
				});
				// check if favorite locations response is ok
				if (favLocationsResponse.ok) {
					setUsername("");
					setFname("");
					setLname("");
					setEmail("");
					setPassword("");
					setConfirmPassword("");
					setCity("");
					setState("");
					setZip("");
					setSuccessMessage('Signup successful! Redirecting to login page...');
					// navigate to login page after a short delay
					setTimeout(() => {
						handleNavigate("/");
					}, 4000);
				} else {
					// if favorite locations response is not ok, then delete the newly added user
					await deleteUser(userid);
					setUsername("");
					setFname("");
					setLname("");
					setEmail("");
					setPassword("");
					setConfirmPassword("");
					setCity("");
					setState("");
					setZip("");
					fnameInputRef.current.focus();
					const errorData = await favLocationsResponse.json();
					setGeneralError('Failed to add hometown location', errorData.error);
				}
			} catch (locationError) {
				await deleteUser(userid);
				setUsername("");
				setFname("");
				setLname("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
				setCity("");
				setState("");
				setZip("");
				fnameInputRef.current.focus();
				setGeneralError('Error adding hometown location', locationError);
			}
    } catch (error) {
      setUsername("");
			setFname("");
			setLname("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setCity("");
			setState("");
			setZip("");
			fnameInputRef.current.focus();
      setGeneralError('Error during signup', error);
    }
	};

	return(
		<div id="sign-up-wrapper-wide" className="password-reset-wrapper">
			<title>J.A.K.E. Weather - Sign Up</title>
			<form onSubmit={handleSubmit}>
				<h1>Welcome to J.A.K.E. Weather!</h1>
				<div className="form-row">
					<div className="form-group">
						<label htmlFor="fnameInput">First Name:</label>
						<input id="fnameInput" type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required ref={fnameInputRef} />
					</div>
					<div className="form-group">
						<label htmlFor="lnameInput">Last Name:</label>
						<input id="lnameInput" type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
					</div>
				</div>
				<div className="form-row">
					<div className="form-group">
						<label htmlFor="usernameInput">Username:</label>
						<input id="usernameInput" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required ref={usernameInputRef}/>
						{usernameError && <p className='error-message'>{usernameError}</p>}
					</div>
					<div className="form-group">
						<label htmlFor="emailInput">Email:</label>
						<input id="emailInput" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
				</div>
				<div className="form-row">
					<div className="form-group">
						<label htmlFor="passwordInput">Password:</label>
						<div className="password-input-container">
							<input 
								id="passwordInput" 
								type={isPasswordVisible ? 'text' : 'password'}
								placeholder="********" 
								value={password} 
								onChange={(e) => setPassword(e.target.value)} 
								required 
								ref={passwordInputRef}
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="password-toggle-button"
								aria-label={isPasswordVisible ? 'Hide Password' : 'Show Password'}
							>
								{isPasswordVisible ? '🔒' : '👁️'}
							</button>
						</div>
						{passwordError && <p className='error-message'>{passwordError}</p>}
					</div>
					<div className="form-group">
						<label htmlFor="confirmPasswordInput">Confirm Password:</label>
						<div className="password-input-container">
							<input 
								id="confirmPasswordInput" 
								type={isConfirmPasswordVisible ? 'text' : 'password'}
								placeholder="********" 
								value={confirmPassword} 
								onChange={(e) => setConfirmPassword(e.target.value)} 
								required 
								ref={confirmPasswordInputRef}
							/>
							<button
								type="button"
								onClick={toggleConfirmPasswordVisibility}
								className="password-toggle-button"
								aria-label={isConfirmPasswordVisible ? 'Hide Password' : 'Show Password'}
							>
								{isConfirmPasswordVisible ? '🔒' : '👁️'}
							</button>
						</div>
						{confirmPasswordError && <p className='error-message'>{confirmPasswordError}</p>}
					</div>
				</div>
				<div className="form-row">
					<div className="hometown-group">
						<label htmlFor="cityInput" className="hometown-label">Hometown Location:</label>
						<div className="hometown-inputs-row">
							<div id="hometownLocation" className="form-group">
								<label htmlFor="cityInput">City:</label>
								<input id="cityInput" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
							</div>
							<div className="form-group form-group-narrow">
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
							</div>
						</div>
					</div>
				</div>
				<div className="form-row">
          <div className="form-group zip-group-left">
						<label htmlFor="zipInput">Zip:</label>
						<input id="zipInput" type="text" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} required ref={zipInputRef}/>
					</div>
				</div>
				{generalError && <p className='error-message'>{generalError}</p>}
				{successMessage && <p className='success-message'>{successMessage}</p>}
				<button id="signupButton" type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default Signup;