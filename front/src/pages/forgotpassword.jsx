import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function ForgotPassword() {
	const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

	// useState hooks for forgot password form fields
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

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
	const usernameInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const confirmPasswordInputRef = useRef(null);

	// password complexity regex
	const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).*$/;

	// functions to toggle password and confirm password visibility
	const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

	// handle the password reset attempt
	const handleSubmit = async (e) => {
		e.preventDefault();
	
		// clear previous errors and success message
		setUsernameError("");
		setPasswordError("");
		setConfirmPasswordError("");
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
		if (hasError) {
			return; // stop if there are validation errors
		}

		// proceed to reset password with API calls
		try {
			// step 1: check if the user's username exists
			const existsResponse = await fetch(`http://localhost:5000/user/exists/${username}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			// handle 500 errors from the back
			if (!existsResponse.ok) {
				setGeneralError('Server error while checking username existence');
				return;
			}

			const existsData = await existsResponse.json();

			// check if user does not exist
			if (!existsData.exists) {
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				usernameInputRef.current.focus();
				setGeneralError('User account does not exist');
				return;
			}
			// get userid from response
			const userid = existsData.userid;

			// step 2: check if the user's new password is different from the old password
			const diffpassResponse = await fetch(`http://localhost:5000/user/diffpass/${userid}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ new_password: confirmPassword }),
			});
			// handle 500 errors from the back
			if (!diffpassResponse.ok) {
				setGeneralError('Server error while checking different password');
				return;
			}

			const diffpassData = await diffpassResponse.json();

			// check if the new password is different
			if (!diffpassData.different) {
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				usernameInputRef.current.focus();
				setGeneralError('New password must be different from the old password');
				return;
			}

			// step 3: update the user's password in the database
			const updatepassResponse = await fetch(`http://localhost:5000/user/updatepass/${userid}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ new_password: confirmPassword }),
			});
			// check if the response is ok
			if (updatepassResponse.ok) {
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				setSuccessMessage('Password reset successful! Redirecting to login page...');
				// navigate to login page after a short delay
				setTimeout(() => {
					handleNavigate("/");
				}, 4000);
			} else {
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				usernameInputRef.current.focus();
				const errorData = await updatepassResponse.json();
				setGeneralError(errorData.error || 'Failed to update password');
			}
		} catch (error) {
			setUsername("");
			setPassword("");
			setConfirmPassword("");
			usernameInputRef.current.focus();
			setGeneralError('Error during password reset');
		}
	};

	return(
		<div className="password-reset-wrapper">
			<title>J.A.K.E. Weather - Forgot Password</title>
			<form onSubmit={handleSubmit}>
				<h1>Forgot your password? Reset it below</h1>
				<label htmlFor="usernameInput">Username:</label>
				<input id='usernameInput' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required ref={usernameInputRef}/>
				{usernameError && <p className='error-message'>{usernameError}</p>}
				<label htmlFor="passwordInput">New Password:</label>
				<div className="password-input-container">
					<input 
						id='passwordInput' 
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
				<label htmlFor="confirmPasswordInput">Confirm New Password:</label>
				<div className="password-input-container">
					<input 
						id='confirmPasswordInput' 
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
				{generalError && <p className='error-message'>{generalError}</p>}
				{successMessage && <p className='success-message'>{successMessage}</p>}
				<button id='signupButton' type="submit">Reset Password</button>
			</form>
		</div>
	);
};

export default ForgotPassword;