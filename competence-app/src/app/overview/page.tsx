'use client';

import React, { useEffect, useState } from 'react'; 
import { useAuth } from '@/context/AuthContext'; 
import SummaryScore from '@/components/SummaryScore';
import UserDisplay from '@/components/UserDisplay';
import EleveDisplay from '@/components/EleveDisplay';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import LayoutDisplay from '@/components/LayoutDisplay';
import { isTokenExpired ,getTokenFromCookies} from '@/utils/jwt';  
import { useRouter } from 'next/navigation';

const Overview: React.FC = () => { 
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<boolean>(false);
  const { activeCatalogues, activeEleve, activeReport, user, activeLayout} = useAuth();  

 

  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies(); // Automatically gets the token from cookies

    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    } 

    //console.log('Active Catalogues:', activeCatalogues);
    //console.log('Active Eleve:', activeEleve); 
    //console.log('Active Report:', activeReport); 
    //console.log('Active Report:', activeLayout); 
    setLoading(false);
  }, [activeCatalogues, activeEleve, activeReport,activeLayout,router]);

  // Handle error state if needed
  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
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
