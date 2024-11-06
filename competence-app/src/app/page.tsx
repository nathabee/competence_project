// src/app/page.tsx
'use client'; // Mark this as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import './globals.css'; // Import global styles

export default function HomePage() {
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "bad";

  useEffect(() => {
    const { token } = parseCookies();

    if (token) {
      // Try to retrieve roles from localStorage
      const storedRoles = localStorage.getItem('userRoles');
      const roles = storedRoles ? JSON.parse(storedRoles) : [];

      console.log("Roles from localStorage:", roles); // Log roles for debugging

      // Check roles and redirect accordingly
      if (roles.includes('admin')) {
        router.push('/admin');
      } else if (roles.includes('teacher')) {
        router.push('/dashboard');
      } else if (roles.includes('statistic')) {
        router.push('/statistiques');
      }
    } else {
      // Redirect to login if no token exists
    router.push('/home');
    }
  }, [router, basePath]);

  return (
    <div className="container">
      <h1>Welcome to Competence App! This is the return of the app/page.tsx</h1> 
    </div>
  );
}
