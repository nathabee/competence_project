'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import EleveDisplay from '@/components/EleveDisplay'; // Ensure this is correctly imported
import EleveForm from '@/components/EleveForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext'; 

const ElevePage: React.FC = () => {
  const router = useRouter();
  const { eleves, setEleves } = useAuth(); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [selectedEleve, setSelectedEleve] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false); 

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1];

      if (!token) {
        router.push(`/login`);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (eleves.length === 0) {
          const elevesResponse = await axios.get(`${apiUrl}/eleves/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEleves(elevesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, eleves, setEleves]);

  const handleEleveSelect = (id: number) => {
    setSelectedEleve(id); // Set selected Eleve ID
  };

  const handleFormToggle = () => {
    setShowForm(!showForm); // Toggle the form for creating a new Eleve
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Gestion des Élèves</h1>
      
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleFormToggle}>
          {showForm ? 'Annuler' : 'Ajouter un Élève'}
        </button>
      </div>

      {showForm && <EleveForm setEleves={setEleves} closeForm={handleFormToggle} />}

      <h2>Liste des Élèves :</h2>
      {eleves.length > 0 ? (
        <EleveDisplay eleves={eleves} onEleveSelect={handleEleveSelect} />
      ) : (
        <p>Aucun élève trouvé. Veuillez ajouter un nouvel élève.</p>
      )}

      {selectedEleve && (
        <div>
          <h3>Détails de l&apos;Élève Sélectionné</h3>
          <p>Élève ID: {selectedEleve}</p>
          {/* You can expand this section with more details about the selected Eleve */}
        </div>
      )}
    </div>
  );
};

export default ElevePage;
