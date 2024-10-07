'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import EleveDisplay from '@/components/EleveDisplay';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import SummaryScore from '@/components/SummaryScore';

const Overview: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { activeCatalogues, activeEleve, activeReport, eleves } = useAuth(); // Assuming `eleves` is in your AuthContext

  useEffect(() => {
    console.log('Active Catalogues:', activeCatalogues);
    console.log('Active Eleve:', activeEleve); 
    console.log('Active Report:', activeReport); 
    setLoading(false);
  }, [activeCatalogues, activeEleve, activeReport]);

  // Handle error state if needed
  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEleveSelect = (id: number) => {
    // Implement your logic to handle the selection of an eleve
  };

  return (
    <div>
      <h1>Overview Page</h1>

      {/* Eleve Display */}
      <h2>Student Overview</h2>
      <EleveDisplay eleves={eleves} onEleveSelect={handleEleveSelect} />

      {/* Catalogue Display */}
      <h2>Catalogues Overview</h2>
      <CatalogueDisplay catalogue={activeCatalogues} />

      {/* Display summary scores for each report catalogue */}
      <h2>Summary Scores</h2>
      <div className="tab-content mt-3">
        <div className="tab-pane fade show active">
          {activeReport?.report_catalogues.map((catalogue, index) => (
            <SummaryScore 
              key={index} 
              aggregatedDataByMatiere={catalogue} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
