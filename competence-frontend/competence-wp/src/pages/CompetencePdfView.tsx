// src/pages/CompetencePdfView.tsx
'use client';

import React from 'react';
import {useProtectedPage}  from '@hooks/useProtectedPage';
import { useAuth } from '@context/AuthContext';

import ActiveContextCard from '@components/ActiveContextCard';
import PDFComponent from '@components/PDFComponent';

const CompetencePdfView: React.FC = () => {
  useProtectedPage(); // handles token check and redirect

  const {
    activeReport,
    activeEleve,
    activeCatalogues,
    activeLayout,
    user,
  } = useAuth();

  return (
    <div className="container mt-3 ml-2">
      <ActiveContextCard />

      {(!activeEleve || !activeCatalogues?.length || !activeLayout || !activeReport || !user) ? (
        <p className="text-warning mt-3">
          ⚠️ Veuillez d'abord sélectionner un élève, un catalogue, une mise en page et un report et être connecté.
        </p>
      ) : (
        <PDFComponent
          report={activeReport}
          eleve={activeEleve}
          professor={user}
          pdflayout={activeLayout}
          isImageChart={true}
        />
      )}
    </div>
  );
};

export default CompetencePdfView;
