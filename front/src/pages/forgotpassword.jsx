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
	
		// provide input validation here

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
				console.error('Server error while checking username existence');
				return;
			}

			const existsData = await existsResponse.json();

			// check if user does not exist
			if (!existsData.exists) {
				console.log('User does not exist with this username:', username);
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
				console.error('Server error while checking different password');
				return;
			}

			const diffpassData = await diffpassResponse.json();

			// check if the new password is different
			if (!diffpassData.different) {
				console.log('New password must be different from the old password');
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
				console.log('Password reset successful');
				// navigate to login page
				handleNavigate("/");
			} else {
				setUsername("");
				setPassword("");
				setConfirmPassword("");
				const errorData = await updatepassResponse.json();
				console.error('Password reset failed:', errorData.error);
			}
		} catch (error) {
			setUsername("");
			setPassword("");
			setConfirmPassword("");
			console.error('Error during password reset:', error);
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