// src/app/login/LoginForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import useFetchData from '@/hooks/useFetchData';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { fetchData } = useFetchData();
  const searchParams = useSearchParams(); // Access URL parameters
  

  useEffect(() => {


    const user = searchParams.get('user');
    if (user) {
      setUsername(user);  
      
      const pwd = searchParams.get('password');
      if (pwd) { 
        setPassword(pwd); 
      }
      else {
        setPassword('X');   // normally invalid because too small . For demo version it is not checked

      }

    }
  }, [ ]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
      login(token, userInfo);
      await fetchData();
      router.push(`/dashboard`);
    } catch (error) {
      const axiosError = error as AxiosError;
      setErrorMessage(axiosError.response?.status === 401 ? 'Invalid username or password' : 'Connection error');
    }
  };
 

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Login</h5>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
                required
                autoComplete="current-password"
                value={password}
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
