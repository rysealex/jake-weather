import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
	const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(url);
  };

	// useState hooks for forgot password form fields
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	// handle the password reset attempt
	const handleSubmit = async (e) => {
		e.preventDefault();
		return;
	
		// provide input validation here

		// proceed to reset password with API calls
		try {
			// step 1: check if the user's username exists

			// step 2: check if the user's new password is different from the old password

			// step 3: update the user's password in the database
		} catch (error) {

		}
	};

	return(
		<div>
			<h1>Forgot Password Page</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
				<button type="submit">Reset Password</button>
			</form>
		</div>
	);
};

export default ForgotPassword;