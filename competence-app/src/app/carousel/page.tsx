'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt'; 
 
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import TestCarousel from '@/components/TestCarousel'; 

const CarouselPage: React.FC = () => {
  const router = useRouter(); 
  const [loading, setLoading] = useState<boolean>(true);
  //const [isError, setIsError] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);


  // Retrieve the token client-side only
  useEffect(() => {
    const retrievedToken = getTokenFromCookies();
    if (!retrievedToken || isTokenExpired(retrievedToken)) {
      router.push(`/login`);
    } else {
      setToken(retrievedToken);
      setLoading(false); // Set loading to false once token is verified
    }
 
  }, [router,  ]);

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Chargement des données...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!token) return null; // Don't render if there's no valid token
 

  return (
    <div className="container mt-3 ml-2"> 
        <TestCarousel   /> 
    </div>
  );
};

export default CarouselPage;
