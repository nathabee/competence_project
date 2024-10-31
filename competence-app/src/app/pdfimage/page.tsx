'use client';


//import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PDFComponent from '@/components/PDFComponent'; // Import your new PDFComponent
import { isTokenExpired ,getTokenFromCookies } from '@/utils/jwt';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';  


const PdfImage = () => {
  const { activeReport, activeEleve, user, activeLayout } = useAuth();

 

  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookies(); // Automatically gets the token from cookies

    if (!token || isTokenExpired(token)) {
      router.push(`/login`);
      return;
    }
  }, [router]);

  if (!activeEleve || !user || !activeReport || !activeLayout) {
    return <p>Loading data...</p>; // Handle loading state
  }

  return (
    <div className="container mt-3 ml-2">  
      <PDFComponent
        report ={activeReport} //reportCatalogues={activeReport.report_catalogues}
        eleve={activeEleve}
        professor={user}
        pdflayout={activeLayout}
        isImageChart={true}  // Set to true for the second instance 
      />
    </div>
  );
  
};

export default PdfImage;
