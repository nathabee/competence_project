'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TeacherInfo from '@/components/Teacher';
import CatalogueSelection from '@/components/CatalogueSelection';
import EleveList from '@/components/EleveList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eleve } from '@/types/eleve';
import { useAuth } from '@/context/AuthContext';
import { useTestContext } from '@/context/TestContext';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { activeCatalogue } = useTestContext(); 
  const { user, isLoggedIn } = useAuth();
  const [catalogue, setCatalogue] = useState([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1];
    
      if (!token) {
        router.push(`/login`);
        return;
      }
    
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch Catalogue
        const catalogueResponse = await axios.get(`${apiUrl}/catalogues/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCatalogue(catalogueResponse.data);

        // Fetch Eleves
        const elevesResponse = await axios.get(`${apiUrl}/eleves/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEleves(elevesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
    
        if (axios.isAxiosError(error)) {
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Make sure this return is properly formatted
  if (loading) {
    return <p>Loading data...</p>; // Properly return JSX
  }

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <div className="tab-content mt-3">
        {isLoggedIn && user && <TeacherInfo />}

        <div>
          {activeCatalogue ? (
            <p>Active Catalogue: {activeCatalogue.description}</p>
          ) : (
            <p>No active catalogue selected</p>
          )}
        </div>

        <CatalogueSelection catalogue={catalogue} />
        {eleves.length > 0 ? <EleveList eleves={eleves} /> : <p>No students found</p>}
      </div>
    </div>
  );
};

export default Dashboard;
