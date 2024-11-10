'use client';
 

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LayoutDisplay from '@/components/LayoutDisplay';
import LayoutSelection from '@/components/LayoutSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext'; 
import { getTokenFromCookies } from '@/utils/jwt'; 
import useTranslation from '@/utils/translationHelper';
 
 
   

  const Configuration: React.FC = () => {
    const router = useRouter();
    const { layouts, activeLayout } = useAuth(); 
    const  t  = useTranslation(); // Hook to use translations
  
    // Use useEffect to set the token client-side only
    useEffect(() => {
      const retrievedToken = getTokenFromCookies();
      if (!retrievedToken  ) {
          router.push(`/login`);
      }  
  }, [router]);



   
  

  
  return (
    <div className="container mt-3 ml-2">
      <h1>Configuration</h1> 
      <div className="tab-content mt-3"> 
 
      {activeLayout ? (
      <LayoutDisplay layout={activeLayout} />  
      ) : (
        <p>{t("msg_noSelectConf")}</p>
      )}
 
      {layouts.length === 0 ? (
        <p>{t("msg_noConf")}</p>
      ) : (
        <LayoutSelection layouts={layouts} />
      )}
    </div>
    </div>
  );
};

export default Configuration;

   
  