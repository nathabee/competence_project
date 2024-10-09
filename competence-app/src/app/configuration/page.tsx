'use client';
 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LayoutDisplay from '@/components/LayoutDisplay';
import LayoutSelection from '@/components/LayoutSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { isTokenExpired,getTokenFromCookies } from '@/utils/jwt';  


const Configuration: React.FC = () => {
  const router = useRouter();
  const {  
    setLayouts, 
    layouts, 
    activeLayout, 
  } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromCookies(); // Automatically gets the token from cookies
  
      if (!token || isTokenExpired(token)) {
        router.push(`/login`);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try { 

        if (layouts.length === 0) {
          const layoutsResponse = await axios.get(`${apiUrl}/pdf_layouts/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLayouts(layoutsResponse.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);  // Adding dependencies as needed

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Loading data...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching data. Please try again.</p>;
  }

  return (
    <div className="container mt-3 ml-2">
      <h1>Configuration</h1>
      <div className="tab-content mt-3"> 

      <h2>Active Layout :</h2>
      {activeLayout ? (
      <LayoutDisplay layout={activeLayout} />  
      ) : (
        <p>No active layout selected.</p>
      )}
 
      {layouts.length === 0 ? (
        <p>No layout found.</p>
      ) : (
        <LayoutSelection layouts={layouts} />
      )}
    </div>
    </div>
  );
};

export default Configuration;

   
  