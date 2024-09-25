'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CatalogueDisplay from '@/components/CatalogueDisplay';

const Pdf = () => {
  const { activeCatalogue, activeEleve, catalogue, eleves } = useAuth();

  useEffect(() => {
    console.log('Active Catalogue:', activeCatalogue);
    console.log('Active Eleve:', activeEleve);
    console.log('Catalogue:', catalogue);
    console.log('Eleves:', eleves);
  }, [activeCatalogue, activeEleve, catalogue, eleves]);

  return (
    <div>
      <h1>Pdf Page</h1>

      <h2>DEBUG:</h2>

      <h2>Donnees selectionnees :</h2>
      <div>
        {activeEleve ? (
          <p>Active Eleve: {activeEleve.nom} {activeEleve.prenom} {activeEleve.classe}</p>
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

      <div>
        {catalogue && catalogue.length > 0 ? (
          <div>
            <p>Catalogue IS fetched in cache</p>
            <CatalogueDisplay catalogue={catalogue} />
          </div>
        ) : (
          <p>No catalogue fetched in cache</p>
        )}
      </div>

      <div>
        {eleves && eleves.length > 0 ? (
          <p>Eleves ARE fetched in cache</p>
        ) : (
          <p>No eleves fetched in cache</p>
        )}
      </div>
    </div>
  );
};

export default Pdf;
