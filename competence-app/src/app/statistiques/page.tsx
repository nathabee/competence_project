
'use client'; // Mark this as a Client Component
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isTokenExpired,getTokenFromCookies } from '@/utils/jwt';  

const Statistiques = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies(); // Automatically gets the token from cookies

    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    }
  }, [router]);

  return (
    <div className="container mt-3 ml-2">
      <h1>Dashboard</h1>
      <ul className="nav nav-tabs"> 
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push('/statistiques/configuration')}>Configuration</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => router.push('/statistiques/pdf')}>PDF</a>
        </li> 
      </ul>

      <div className="tab-content mt-3">
        {/* Dynamic routing will load here based on tab selection */}
      </div>
    </div>
  );
};

export default Statistiques;
