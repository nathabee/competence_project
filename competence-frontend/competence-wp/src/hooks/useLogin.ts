'use client';
// src/hooks/useLogin.ts

// shared component
// use client is needed by nextjs (useeeffect...) but will be ignored by wordpress


import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@context/AuthContext';
import useFetchData from '@hooks/useFetchData';
import  { getApiUrl } from '@utils/helper'; 

export function useLoginHandler() {
  const { login } = useAuth();
  const { fetchData } = useFetchData();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

 
  const apiUrl = getApiUrl();
 

  const handleLogin = async (username: string, password: string, onSuccess: () => void) => {
    try {
      console.log("Login attempt:", { username });
      console.log("API URL:", apiUrl);

      
      const response = await axios.post(`${apiUrl}/token/`, {
        username,
        password,
      }) 

      const { access: token } = response.data;
      const userResponse = await axios.get(`${apiUrl}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userInfo = userResponse.data;
      login(token, userInfo);
      await fetchData();
      onSuccess(); // route or redirect handled externally
    } catch (error) {
      console.error("Login failed:", error);
      const axiosError = error as AxiosError;
      console.error("Login failed  axiosError:", axiosError);
      setErrorMessage(
        axiosError.response?.status === 401
          ? 'Invalid username or password'
          : 'Connection error'
      );
    }
  };

  return { handleLogin, errorMessage };
}



 