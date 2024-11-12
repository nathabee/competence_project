// src/app/login/page.tsx


import LoginForm from '@/app/login/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}

/*
'use client';
import { useEffect, useState } from 'react';
//import { useRouter } from 'next/navigation';
import LoginForm from '@/app/login/LoginForm';

export default function LoginPage() {
  //const router = useRouter();
  const [initialUsername, setInitialUsername] = useState<string | undefined>(); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user'); 

    // Only set initial values if they are provided in the URL
    if (username) setInitialUsername(username); 
  }, []);

  return (
    <LoginForm initialUsername={initialUsername}  />
  );
}
*/