'use client';

import React from 'react';
import { Eleve } from '@/types/eleve'; // Import the Eleve type
import UserDisplay from '@/components/UserDisplay'; // Import the UserDisplay component

interface EleveDisplayProps {
  eleve?: Eleve | null; // eleve is optional and can be null
}

const EleveDisplay: React.FC<EleveDisplayProps> = ({ eleve }) => {
  if (!eleve) {
    return <p>No student information available.</p>; // Handle case when eleve is not passed
  }

  return (
    <div>
      <p>Active Eleve: {eleve.nom} {eleve.prenom} {eleve.niveau_niveau}   Date de naissance: {eleve.datenaissance}  </p>
      <p>Professeurs:</p>
      {eleve.professeurs_details.length > 0 ? (
        <ul>
          {eleve.professeurs_details.map(prof => (
            <li key={prof.id}>
              <UserDisplay user={prof} /> 
            </li>
          ))}
        </ul>
      ) : (
        <p>No assigned professors</p>
      )}
    </div>
  );
};

export default EleveDisplay;
