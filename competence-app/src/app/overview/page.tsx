'use client';

import React, { useEffect } from 'react'; 
import { useAuth } from '@/context/AuthContext'; 
import SummaryScore from '@/components/SummaryScore';
import SummaryDifficulty from '@/components/SummaryDifficulty';
import SummaryDetailedDifficulty from '@/components/SummaryDetailedDifficulty';


import useTranslation from '@/utils/translationHelper';

import UserDisplay from '@/components/UserDisplay';
import EleveDisplay from '@/components/EleveDisplay';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import LayoutDisplay from '@/components/LayoutDisplay';
import { isTokenExpired ,getTokenFromCookies} from  '@/utils/jwt';  
import { useRouter } from 'next/navigation'; 

const Overview: React.FC = () => {  
  const { activeCatalogues, activeEleve, activeReport, user, activeLayout} = useAuth();  

  const t = useTranslation();

  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies(); // Automatically gets the token from cookies

    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    } 

 
  }, [router]);

 

  if (!activeEleve || !user || !activeReport || !activeLayout || !activeCatalogues) {
    return <p>{t('msg_load')}</p>; // Handle loading state
  }

 

  return ( 
    <div className="container mt-3 ml-2">
      <h1>{t('pgH_summaryTest')} :</h1> 
 

      <h3>{t('pdf_prof')}: </h3>
      <UserDisplay user={user} /> 

      <h3>{t('pdf_stdt')}: </h3>
      <EleveDisplay eleve={activeEleve} /> 

      <h3>{t('tbH_CatalogTest')}: </h3>
      <CatalogueDisplay selectedCatalogue={activeCatalogues}  />

      <h1>{t('pdf_lytChosen')}:</h1>
      <LayoutDisplay layout={activeLayout} />  


      <h2>{t('pgH_summaryScor')}:</h2> 
      <SummaryScore report_catalogues={activeReport?.report_catalogues ?? []} /> 

    <h2>{t('pgH_summaryDifficult')}:</h2> 
    <SummaryDifficulty report_catalogues={activeReport?.report_catalogues ?? []} />

    <h2>{t('tbH_detailRptPb')}:</h2> 
    
    {activeReport ? (
                    <>
    <SummaryDetailedDifficulty  eleve={activeEleve}    professor={user}   pdflayout={activeLayout} report={activeReport} max_item={40} self_page={true} /> 
                    </>
                ) : (
                    <p>{t('msg_noRpt')}</p>
                )}
 
    
    </div>


  );
};

export default Overview;
