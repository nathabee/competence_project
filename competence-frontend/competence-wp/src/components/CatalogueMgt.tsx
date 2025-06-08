 

'use client';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CatalogueDisplay from '@components/CatalogueDisplay';
import CatalogueSelection from '@components/CatalogueSelection';
import { useAuth } from '@context/AuthContext';
import { getToken } from '@utils/jwt'; 

const CatalogueMgt: React.FC = () => {
  const navigate = useNavigate(); 
const { activeCatalogues, catalogue } = useAuth();


  useEffect(() => {
    const token = getToken();
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div className="container mt-3 ml-2">
      <h1>Catalogue Management</h1>

      <div className="tab-content mt-3">
        <h2>Selected Catalogue(s)</h2>
        {activeCatalogues.length > 0 ? (
          <CatalogueDisplay selectedCatalogue={activeCatalogues} />
        ) : (
          <p>No catalogue selected</p>
        )}

        <h2>Available Tests</h2>
{catalogue.length === 0 ? (
  <p>No catalogue data found</p>
) : (
  <CatalogueSelection catalogue={catalogue} />
)}

      </div>
    </div>
  );
}; 

export default CatalogueMgt;
