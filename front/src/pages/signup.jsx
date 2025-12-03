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
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	// useState hooks for error handling
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [generalError, setGeneralError] = useState('');

	// useState hook for success message
	const [successMessage, setSuccessMessage] = useState('');

	// refs for login input fields
	const usernameInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const stateInputRef = useRef(null);
	const zipInputRef = useRef(null);

	// password complexity regex
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).*$/;

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
				setCity("");
				setState("");
				setZip("");
				usernameInputRef.current.focus();
				setGeneralError('User account already exists');
				return;
			}

			// step 2: create the user
      const response = await fetch('http://localhost:5000/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, fname, lname, email, password, city, state, zip }),
      });
      // check if the response is ok
      if (response.ok) {
				setUsername("");
				setFname("");
				setLname("");
				setEmail("");
				setPassword("");
				setCity("");
				setState("");
				setZip("");
        setSuccessMessage('Signup successful! Redirecting to login page...');
				// navigate to login page after a short delay
				setTimeout(() => {
					handleNavigate("/");
				}, 4000);
      } else {
        setUsername("");
				setFname("");
				setLname("");
				setEmail("");
        setPassword("");
				setCity("");
				setState("");
				setZip("");
				usernameInputRef.current.focus();
        const errorData = await response.json();
        setGeneralError(errorData.error || 'Failed to add user');
      }
    } catch (error) {
      setUsername("");
			setFname("");
			setLname("");
			setEmail("");
			setPassword("");
			setCity("");
			setState("");
			setZip("");
			usernameInputRef.current.focus();
      setGeneralError('Error during signup', error);
    }
	};

	return(
		<div className="sign-up-wrapper">
			<h1 className="sign-up-header">Welcome to J.A.K.E. Weather!</h1>
			<form className="sign-up-wrapper form" onSubmit={handleSubmit}>
				<input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
				<input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required ref={usernameInputRef}/>
				{usernameError && <p>{usernameError}</p>}	
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required ref={passwordInputRef}/>
				{passwordError && <p>{passwordError}</p>}
				<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
				<input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required ref={stateInputRef}/>
				<input type="text" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} required ref={zipInputRef}/>
				{generalError && <p>{generalError}</p>}
				{successMessage && <p>{successMessage}</p>}
				<button id="signupButton" type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default Signup;