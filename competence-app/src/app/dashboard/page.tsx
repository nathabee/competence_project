'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TeacherInfo from '@/components/Teacher';
import CatalogueSelection from '@/components/CatalogueSelection';
import EleveSelection from '@/components/EleveSelection';
import ReportEleveSelection from '@/components/ReportEleveSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { activeCatalogues, activeEleve, catalogue, setCatalogue, eleves, setEleves, user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false); // Define error state

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1]?.split(';')[0]; // Handle cookie parsing more safely

      if (!token) {
        router.push(`/login`);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        console.log(`DASHBOARD Token: Bearer ${token}`);
        console.log(`DASHBOARD Request URL: ${apiUrl}/catalogues/`);
        console.log(`DASHBOARD Request URL: ${apiUrl}/eleves/`);

        // Only fetch if catalogue or eleves are not already set
        if (catalogue.length === 0) {
          // Fetch Catalogue
          const catalogueResponse = await axios.get(`${apiUrl}/catalogues/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCatalogue(catalogueResponse.data);
        }

        if (eleves.length === 0) {
          // Fetch Eleves
          const elevesResponse = await axios.get(`${apiUrl}/eleves/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEleves(elevesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true); // Set error state on fetch failure
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);  //, catalogue, eleves]); // Ensure effect runs correctly

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Loading data...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching data. Please try again.</p>; // Error handling
  }

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <div className="tab-content mt-3">
        <h2>Professeur :</h2>
        {isLoggedIn && user && <TeacherInfo />}

        <h2>Donnees selectionnees :</h2>
        <div>
          {activeEleve ? (
            <p>Active Eleve: {activeEleve.nom} {activeEleve.prenom} {activeEleve.niveau}</p>
          ) : (
            <p>No active eleve selected</p>
          )}
        </div>

        <h2>Active Catalogues:</h2>
        {activeCatalogues.length > 0 ? (
          <ul>
            {activeCatalogues.map(catalogue => (
              <li key={catalogue.id}>
                {catalogue.description} - {catalogue.annee.annee} - {catalogue.niveau.niveau}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active catalogues selected.</p>
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
      </div>
    </div>
  );
};

export default Dashboard;
