'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@shared/context/AuthContext';
import { loginUser } from '@shared/api/auth';

type Props = {
  onSuccess?: () => void;
  redirectUrl?: string; // ✅ New
  defaultUsername?: string;
  defaultPassword?: string;
};

export function Login({
  onSuccess,
  redirectUrl = '/home',
  defaultUsername = '',
  defaultPassword = '',
}: Props) {
  const { login, token } = useAuth();
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (token) {
      window.location.href = redirectUrl;
    }
  }, [token, redirectUrl]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const { token, userInfo } = await loginUser(username, password);
      login(token, userInfo);

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = redirectUrl;
      }
    } catch (error: any) {
      const code = error?.response?.status;
      setErrorMessage(code === 401 ? 'Invalid username or password' : 'Connection error');
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
}
