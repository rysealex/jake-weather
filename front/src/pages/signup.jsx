import { useState } from 'react';
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
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zip, setZip] = useState('');

	// handle the signup attempt
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // provide input validation here

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
				console.log('User already exists');
				return;
			}

			// step 2: create the user
      const response = await fetch('http://localhost:5000/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, fname, lname, email, password, country, city, state, zip }),
      });
      // check if the response is ok
      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
				// navigate to login page
        handleNavigate("/");
      } else {
        setUsername("");
				setFname("");
				setLname("");
				setEmail("");
        setPassword("");
				setCountry("");
				setCity("");
				setState("");
				setZip("");
        const errorData = await response.json();
        console.log('Signup failed:', errorData.error);
      }
    } catch (error) {
      setUsername("");
			setFname("");
			setLname("");
			setEmail("");
			setPassword("");
			setCountry("");
			setCity("");
			setState("");
			setZip("");
      console.error('Error during signup:', error);
    }
	};

	return(
		<div>
			<h1>Signup Page</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
				<input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
				<input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
				<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
				<input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
				<input type="text" placeholder="Zip" value={zip} onChange={(e) => setZip(e.target.value)} required />
				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default Signup;