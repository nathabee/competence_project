
'use client'; // Mark this as a Client Component
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Statistiques = () => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('authToken=')[1];
    if (!token) {
      router.push('/login');
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
