import { useState } from 'react';
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

	// handle the login attempt
	const handleSubmit = async (e) => {
		e.preventDefault();

		// provide input validation here

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
        const errorData = await response.json();
        console.log('Login failed:', errorData.error);
      }
		} catch (error) {
			setUsername("");
			setPassword("");
			console.error('Error during login:', error);
		}
	};

	return(
		<div>
			<h1>Login Page</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<button type="submit">Log In</button>
			</form>
		</div>
	);
};

export default Login;