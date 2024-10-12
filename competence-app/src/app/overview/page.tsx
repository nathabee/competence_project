'use client';

import React, { useEffect } from 'react'; 
import { useAuth } from '@/context/AuthContext'; 
import SummaryScore from '@/components/SummaryScore';
import UserDisplay from '@/components/UserDisplay';
import EleveDisplay from '@/components/EleveDisplay';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import LayoutDisplay from '@/components/LayoutDisplay';
import { isTokenExpired ,getTokenFromCookies} from '@/utils/jwt';  
import { useRouter } from 'next/navigation';

const Overview: React.FC = () => {  
  const { activeCatalogues, activeEleve, activeReport, user, activeLayout} = useAuth();  

 

  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies(); // Automatically gets the token from cookies

    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    } 

 
  }, [router]);

 

  if (!activeEleve || !user || !activeReport || !activeLayout || !activeCatalogues) {
    return <p>Loading data...</p>; // Handle loading state
  }

 

  return ( 
    <div className="container mt-3 ml-2">
      <h1>Overview Page</h1>

      {/* Active selected data */}
      <h2>Donnees selectionnees :</h2>

      <h3>Professeur : </h3>
      <UserDisplay user={user} /> 

      <h3>Eleve : </h3>
      <EleveDisplay eleve={activeEleve} /> 

      <h3>Catalogue : </h3>
      <CatalogueDisplay selectedCatalogue={activeCatalogues}  />

      <h1>Welcome to the Layout Display</h1>
      <LayoutDisplay layout={activeLayout} />  


      <h2>Résumé des scores :</h2> 
      <SummaryScore report_catalogues={activeReport?.report_catalogues ?? []} />
    </div>
  );
};

export default Overview;
