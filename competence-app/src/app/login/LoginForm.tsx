'use client';
// src/app/login/LoginForm.tsx


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios'; 
import { useAuth } from '../../context/AuthContext';

import useFetchData from '@/hooks/useFetchData'; // Import your hook

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { fetchData } = useFetchData(); // Get the fetch function from the hook

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        { username, password }
      );

      const { access: token } = response.data; 

      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfo = userResponse.data;
      console.log("userInfo",userInfo);
      login(token, userInfo);



      // Call the fetch data function after login
      // console.log("fetchData will be called")
      await fetchData(); // Wait for the data fetching to complete
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
};

export default LoginForm;

