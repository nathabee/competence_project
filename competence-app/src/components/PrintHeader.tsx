'use client';

import React, { useEffect, useRef } from 'react';
import { PDFLayout } from '../types/pdf';
import { User } from '../types/user';
import { Eleve } from '../types/eleve';
import { Report } from '../types/report';
import { formatDate } from '@/utils/helper';
import useTranslation from '@/utils/translationHelper';

interface PrintHeaderProps {
  layout: PDFLayout;
  professor: User;
  eleve: Eleve;
  report: Report;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ layout, professor, eleve, report }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const  t  = useTranslation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const image = new Image();
      // Set the image source to the Base64 encoded string
      image.src = layout.header_icon_base64; // Updated to use the new property

      image.onload = () => {
        // Set canvas size based on image size and draw it
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      };

      image.onerror = (error) => {
        console.error(t('msg_loadErrIcon'), error);
      };
    }
  }, [layout.header_icon_base64]); // Updated dependency to use the new property

  return (
    <div className="print-header-container">
      <div id="print-header-logo-container">
        <div id="print-header-logo">
          <canvas ref={canvasRef} id="headerCanvas"></canvas>
        </div>
        <div id="print-header-school">
          <div>{layout.schule_name}</div>
        </div>
      </div>
      <div className="print-header-gap">   </div>
      <div className="print-header-info">
        <div className="print-header-professor">
          <div>{t('pdf_prof')} : {professor.last_name} {professor.first_name} </div>
        </div> 

        <div className="print-header-eleve">
          <div>{t('pdf_stdt')} : {eleve.nom}  {eleve.prenom} , {eleve.niveau_description}</div>
        </div>
        <div>
          <p>{t('pdf_rptCreatDt')}: {formatDate(report.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;
