'use client';

// src/pages/login.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setCookie } from 'nookies';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Authenticate the user and retrieve the token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        { username, password }
      );

      const { access: token } = response.data;

      // Step 2: Store the token in cookies
      setCookie(null, 'authToken', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      // Step 3: Fetch user info including roles
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfo = userResponse.data; // Contains all user information

      // Step 4: Login and set user in context
      login(token, userInfo);

      // Step 5: Redirect to the dashboard
      router.push(`/dashboard`);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        setErrorMessage('Identifiant ou mot de passe invalide');
      } else {
        setErrorMessage('Erreur lors de la connection');
      }
    }
  };


  /*
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    */
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 ">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Identifiant</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Identifiant"
                required
                autoComplete="username"  
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Mot de passe"
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}


/*
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setCookie } from 'nookies'; 
import { useAuth } from '../../context/AuthContext'; // Adjust the path accordingly

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to log in with:", username);
  
    try {
      // Step 1: Authenticate the user and retrieve the token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        { username, password }
      );
  
      const { access: token } = response.data;
      console.log("Login successful, received token:", token);
  
      // Step 2: Store the token in cookies
      setCookie(null, 'authToken', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });

      // Step 3: Fetch user roles and other user information
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/roles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Step 4: Extract roles and user data
      const roles = userResponse.data.roles || []; // Adjust based on the API response structure
      const userInfo = userResponse.data; // Ensure this contains all required user info
  
      // Step 5: Login and set user roles in context
      login(token, roles); 

      console.log("Roles from API:", roles);
      console.log("User Info:", userInfo);
  
      // Step 6: Redirect to the dashboard
      router.push(`/dashboard`);
    } catch (error) {
      const axiosError = error as AxiosError;
  
      if (axiosError.response && axiosError.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else if (axiosError.code === 'ERR_NETWORK') {
        setErrorMessage('Network Error: Please check your connection or try again later.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      console.error("Login error:", error);
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={password}
                required 
                autoComplete="current-password" 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
*/