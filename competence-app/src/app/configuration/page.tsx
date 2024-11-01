'use client';
 

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LayoutDisplay from '@/components/LayoutDisplay';
import LayoutSelection from '@/components/LayoutSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext'; 
import { isTokenExpired,getTokenFromCookies } from '@/utils/jwt';  
 
 
   

  const Configuration: React.FC = () => {
    const router = useRouter();
    const { layouts, activeLayout } = useAuth();
    const [token, setToken] = useState<string | null>(null);
  
    // Client-only token retrieval using useEffect
    useEffect(() => {
      const retrievedToken = getTokenFromCookies();
      if (!retrievedToken || isTokenExpired(retrievedToken)) {
        router.push(`/login`);
      } else {
        setToken(retrievedToken);
      }
    }, [router]);
  
    if (!token) return null; // Show nothing or a loading indicator until token is verified
  

  
  return (
    <div className="container mt-3 ml-2">
      <h1>Configuration</h1> 
      <div className="tab-content mt-3"> 
 
      {activeLayout ? (
      <LayoutDisplay layout={activeLayout} />  
      ) : (
        <p>Pas de mise en page sélectionnée.</p>
      )}
 
      {layouts.length === 0 ? (
        <p>Pas de mise en page trouvée.</p>
      ) : (
        <LayoutSelection layouts={layouts} />
      )}
    </div>
    </div>
  );
};

export default Configuration;

   
  