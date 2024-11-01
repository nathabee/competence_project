'use client'; // Ensure this is at the top for client-side rendering

import React, { useState } from 'react';
import { EleveSelectionProps, Eleve } from '@/types/eleve'; // Update import path based on your types
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to manage state
import '@/app/globals.css';

const EleveSelection: React.FC<EleveSelectionProps> = ({ eleves }) => {
  const { activeEleve, setActiveEleve } = useAuth(); // Get activeEleve and setter from AuthContext
  const [selectedNiveau, setSelectedNiveau] = useState<string | null>(null);

  if (eleves.length === 0) return <p>Pas d&apos;élève trouvé.</p>;

  // Get unique levels (niveaux)
  const uniqueNiveaux = Array.from(new Set(eleves.map(eleve => eleve.niveau_description)));

  // Filter eleves based on selected niveau
  const filteredEleves = eleves.filter(eleve => {
    return !selectedNiveau || eleve.niveau_description === selectedNiveau;
  });

  // Handle selecting an eleve
  const handleRowClick = (selectedEleve: Eleve) => {
    setActiveEleve(selectedEleve);
  };

  return (
    <div className="mb-4">
      <h2>Élève Selection</h2>

      <div className="filters">
        <label>
          Niveau:
          <select
            value={selectedNiveau || ''}
            onChange={e => setSelectedNiveau(e.target.value || null)}
            style={{ width: '200px', padding: '5px', fontSize: '16px' }} // Inline styling to adjust size
            className="form-select" // Add a class if you want to control via CSS
          >
            <option value="">All</option>
            {uniqueNiveaux.map((niveau, index) => (
              <option key={niveau || index} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
        </label>
      </div>


      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Niveau</th>
            <th>Date de Naissance</th>
            <th>Professeurs</th>
          </tr>
        </thead>
        <tbody>
          {filteredEleves.map(eleve => (
            <tr
              key={eleve.id} // Ensure your Eleve has an id property
              onClick={() => handleRowClick(eleve)}
              className={activeEleve?.id === eleve.id ? 'selected-row' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>{eleve.nom}</td>
              <td>{eleve.prenom}</td>
              <td>{eleve.niveau_description}</td>
              <td>
                {eleve.datenaissance}
              </td>
              <td>
                {eleve.professeurs_details?.map(prof => prof.username).join(', ') || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EleveSelection;