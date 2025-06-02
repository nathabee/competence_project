// src/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@shared/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuth(); 
  // add role, to dispatch , in use effect [] and read and store in auth

  useEffect(() => {
    if (token) {
      router.push('/dashboard'); // Adjust as needed
    } else {
      router.push('/login');
    }
  }, [token,  router]);

  return <p>Redirecting...</p>;
}
