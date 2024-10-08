'use client';
 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserDisplay from '@/components/UserDisplay';
import EleveDisplay from '@/components/EleveDisplay';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import LayoutDisplay from '@/components/LayoutDisplay';
import CatalogueSelection from '@/components/CatalogueSelection';
import EleveSelection from '@/components/EleveSelection';
import ReportEleveSelection from '@/components/ReportEleveSelection';
import LayoutSelection from '@/components/LayoutSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { 
    activeCatalogues, 
    activeEleve, 
    catalogue, 
    setCatalogue, 
    eleves, 
    setEleves, 
    user, 
    isLoggedIn, 
    setLayouts, 
    layouts, 
    activeLayout, 
  } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1]?.split(';')[0];

      if (!token) {
        router.push(`/login`);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        // Fetch Catalogues, Eleves, and Layouts if they are not already set
        if (catalogue.length === 0) {
          const catalogueResponse = await axios.get(`${apiUrl}/catalogues/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCatalogue(catalogueResponse.data);
        }

        if (eleves.length === 0) {
          const elevesResponse = await axios.get(`${apiUrl}/eleves/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEleves(elevesResponse.data);
        }

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
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <div className="tab-content mt-3">

        {/* Active selected data */}
        <h2>Donnees selectionnees :</h2>

        <h3>Professeur : </h3>
        {isLoggedIn && user && <UserDisplay user={user} />}

        <h3>Eleve : </h3>
        {activeEleve ? (
          <EleveDisplay eleve={activeEleve} />
        ) : (
          <p>No active eleve selected</p>
        )}
      </div>

      <h2>Active Catalogues:</h2>
      {activeCatalogues.length > 0 ? (
        <CatalogueDisplay selectedCatalogue={activeCatalogues}   />
      ) : (
        <p>No active catalogues selected.</p>
      )}

      <h2>Active Layout :</h2>
      {activeLayout ? (
      <LayoutDisplay layout={activeLayout} />  
      ) : (
        <p>No active layout selected.</p>
      )}

      <h2>Selection :</h2>
      {catalogue.length === 0 ? (
        <p>No catalogues found.</p>
      ) : (
        <CatalogueSelection catalogue={catalogue} />
      )}

      {eleves.length === 0 ? (
        <p>No eleves found.</p>
      ) : (
        <EleveSelection eleves={eleves} />
      )}

      {activeEleve ? (
        <>
          <h2>Report obtenus par l&apos;eleve selectionne :</h2>
          <ReportEleveSelection eleve={activeEleve} />
        </>
      ) : (
        <p>Please select an eleve to see results.</p>
      )}

      {layouts.length === 0 ? (
        <p>No layout found.</p>
      ) : (
        <LayoutSelection layouts={layouts} />
      )}
    </div>
  );
};

export default Dashboard;
