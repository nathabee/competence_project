// src/app/eleve/page.tsx
 
'use client';

import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '@shared/context/AuthContext';
import { EleveDisplay } from '@shared/components/EleveDisplay'; 
import { EleveSelection } from '@shared/components/EleveSelection';
import { EleveForm } from '@shared/components/EleveForm';  

import { getToken } from '@shared/utils/jwt';

export default function ElevePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken(); // ✅ only run this in the browser
    setToken(t);
    if (!t) {
      router.push('/login');
    }
  }, [router]);

  if (token === null) return null; // Still checking

  return (
    <div>
      <h2>Welcome!</h2>
      <p>This is the eleve page of the competence app. You need to be logged in.</p>
      <button onClick={logout}>Logout</button>

      <div className="mb-4">
        <div className="mb-4">
            <EleveForm />
            <EleveSelection />
            <EleveDisplay />
        </div>  
      </div>
    </div>
  );
}

 

