import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PDFComponent from '@/components/PDFComponent'; // Import your new PDFComponent
import { User } from '@/types/user'; // Import User type for the professor

const Pdf = () => {
  const { activeCatalogues, activeEleve,user } = useAuth();
   const [config, setConfig] = useState({ footerPDFTitre: 'Footer Title', footerPDFMessage1: 'Message 1', footerPDFMessage2: 'Message 2' }); // Sample config

 

  if (!activeEleve || !user || !activeCatalogues) {
    return <p>Loading data...</p>; // Handle loading state
  }

  return (
    <div>
      <h1>PDF Page</h1>
      <PDFComponent 
        reportCatalogues={activeCatalogues} // Pass the catalogues
        eleve={activeEleve}                  // Pass the current student
        professor={user}                // Pass the professor's data
        config={config}                      // Pass configuration for PDF
      />
    </div>
  );
};

export default Pdf;
