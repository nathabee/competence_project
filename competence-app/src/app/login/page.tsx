'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use the API URL from the .env.local file
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/token/`,
        { username, password }
      );

      const { token } = response.data;
      document.cookie = `authToken=${token}; path=/`; // Store JWT in cookies
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      // Cast the error to AxiosError
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else if (axiosError.code === 'ERR_NETWORK') {
        setErrorMessage('Network Error: Please check your connection or try again later.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
