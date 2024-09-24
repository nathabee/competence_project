'use client';

// src/components/Eleve.tsx
import React from 'react';
import { Eleve } from '@/types/eleve';
import Teacher from './Teacher';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

interface EleveProps {
  eleve: Eleve;
}

const EleveComponent: React.FC<EleveProps> = ({ eleve }) => {
  const { user } = useAuth(); // Access user from context

  return (
    <div>
      <h2>{eleve.nom} {eleve.prenom}</h2>
      <p>Class: {eleve.classe}</p>
      <p>Notes:</p>
      <ul>
        <li>{eleve.textnote1 || 'No note 1'}</li>
        <li>{eleve.textnote2 || 'No note 2'}</li>
        <li>{eleve.textnote3 || 'No note 3'}</li>
      </ul>
      <h3>Teacher Information:</h3>
      {user ? (
        <Teacher /> // Use the Teacher component without passing props
      ) : (
        <p>No user information available.</p> // Handle case when user is not available
      )}
    </div>
  );
};

export default EleveComponent;
