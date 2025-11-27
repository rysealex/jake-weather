import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Login() {
	const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

	// useState hooks for login form fields
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	// useState hooks for error handling
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [generalError, setGeneralError] = useState('');

	// refs for login input fields
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

	// password complexity regex
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).*$/;

	// handle the login attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

		// clear previous errors
    setUsernameError("");
    setPasswordError("");
    setGeneralError("");

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
		if (hasError) {
			return; // stop if there are validation errors
		}

		// proceed to login with API calls
		try {
			const response = await fetch('http://localhost:5000/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			// check if the response is ok
      if (response.ok) {
        const userid = await response.json();
        console.log('Login successful:', userid);
        // store the user id in local storage
        localStorage.setItem('userid', userid.userid);
				// navigate to login page
        handleNavigate("/dashboard");
      } else {
        setUsername("");
        setPassword("");
				usernameInputRef.current.focus();
        const errorData = await response.json();
        setGeneralError(errorData.error || 'Account not found with provided credentials');
      }
		} catch (error) {
			setUsername("");
			setPassword("");
			usernameInputRef.current.focus();
			setGeneralError('Error during login:', error);
		}
	};

	return(
		<div>
			<h1>Login Page</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required ref={usernameInputRef} />
				{usernameError && <p>{usernameError}</p>}
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required ref={passwordInputRef} />
				{passwordError && <p>{passwordError}</p>}
				{generalError && <p>{generalError}</p>}
				<button type="submit">Log In</button>
			</form>
		</div>
	);
};

export default Login;