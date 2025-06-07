 
// src/app/login/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginHandler } from '@hooks/useLogin';

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, errorMessage } = useLoginHandler();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(username, password, () => router.push('/dashboard'));
  };

  return (

    <div className="login-wrapper">
      <h2>🔐 Login</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={submit}>
        <input type="text" placeholder="Identifiant" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

/*
'use client';
// src/components/LoginForm.tsx

// shared component
// use client is needed by nextjs (useeeffect...) but will be ignored by wordpress
 
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '@hooks/useLogin';

const LoginForm: React.FC = () => {
  const { handleLogin, errorMessage } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const user = params.get('user');
    const pwd = params.get('password');
    if (user) {
      setUsername(user);
      setPassword(pwd ?? 'X');
    }
  }, [location.search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(username, password, () => navigate('/competence_dashboard'));
  };

  return (
    <div className="login-wrapper">
      <h2>🔐 Login</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Identifiant" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
*/