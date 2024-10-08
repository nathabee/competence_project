'use client';


//import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PDFComponent from '@/components/PDFComponent'; // Import your new PDFComponent
 
const Pdf = () => {
  const { activeReport, activeEleve,user,activeLayout } = useAuth();
   
 

  if (!activeEleve || !user || !activeReport || !activeLayout) {
    return <p>Loading data...</p>; // Handle loading state
  }

  return (
    <div>
      <h1>PDF Page</h1>
      <PDFComponent 
        reportCatalogues={activeReport.report_catalogues } // Pass the catalogues
        eleve={activeEleve}                  // Pass the current student
        professor={user}                // Pass the professor's data
        pdflayout={activeLayout}                      // Pass configuration for PDF
      />
    </div>
  );
};

export default Pdf;
