'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TeacherInfo from '@/components/Teacher';
import CatalogueSelection from '@/components/CatalogueSelection';
import EleveSelection from '@/components/EleveSelection';
import ResultatSelection from '@/components/ResultatSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext'; 

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { activeCatalogue, activeEleve, catalogue, setCatalogue, eleves, setEleves,  user, isLoggedIn } = useAuth();
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
        // Optionally handle error state here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router ]);


 




  if (loading) {
    return <p>Loading data...</p>;
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

        <div>
          {activeCatalogue ? (
            <p>Active Catalogue: {activeCatalogue.description}</p>
          ) : (
            <p>No active catalogue selected</p>
          )}
        </div>

        <h2>Selection :</h2>
        <CatalogueSelection catalogue={catalogue} />
        <EleveSelection eleve={eleves} />
        <h2>Resultats obtenus par l eleve selectionne :</h2>
        <ResultatSelection    />
      </div>
    </div>
  );
};

export default Dashboard;

