'use client';

import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RadarChart from './RadarChart';
import RadarChartImage from './RadarChartImage';
import '@/styles/pdf.css'; // Import global styles
import PrintHeader from './PrintHeader';
import { ReportCatalogue } from '@/types/report';
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';
import { PDFLayout } from '@/types/pdf';

interface PDFComponentProps {
  reportCatalogues: ReportCatalogue[];
  eleve: Eleve;
  professor: User;
  pdflayout: PDFLayout;
  isImageChart?: boolean;
}

const PDFComponent: React.FC<PDFComponentProps> = ({ reportCatalogues, eleve, professor, pdflayout, isImageChart }) => {

  const handlePrintPDF = async () => {
    const printButton = document.querySelector('.btn') as HTMLElement;
    if (printButton) printButton.style.display = 'none';

    const printableSection = document.getElementById('printable-section-1');
    if (!printableSection) return;

    html2canvas(printableSection, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
      const sectionImgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      try {
        doc.addImage(sectionImgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } catch (error) {
        console.error("Failed to add section image to PDF:", error);
      }

      if (printButton) printButton.style.display = 'inline-block';
      const todayFormat = new Date().toISOString().slice(0, 19).replace(/T/, '_').replace(/:/g, '-');
      doc.save(`report_${eleve.nom}__${eleve.prenom}_${todayFormat}.pdf`);
    }).catch((error) => {
      console.error("html2canvas failed:", error);
    });
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handlePrintPDF}>Imprimer PDF</button>
      <div id="printable-section-1" className="print-container">
        <PrintHeader layout={pdflayout} professor={professor} eleve={eleve} />
        <div className="print-banner"><div></div></div>
        <div className="print-chart-title">{pdflayout.header_message}</div>
        <div className="print-charts-container">
          {reportCatalogues.map((reportcatalogue, index) => {
            const labels = reportcatalogue.resultats.map(res => res.groupage.label_groupage);

            // Handle image retrieval and default value
            const labelImages = reportcatalogue.resultats.map(res => { 
              const imageKey = `competence_groupage_icon_${res.groupage.id}`;
              // Check if the image key exists and is valid
              if (imageKey) {
                // Retrieve the Base64 image data from local storage
                const base64Data = localStorage.getItem(imageKey); 
                return base64Data ? base64Data : "assets/logo.png"; // Default image if Base64 not found
              }
              return "assets/logo.png"; // Default image if key is empty or null
            });

            const data = reportcatalogue.resultats.map(res => (res.seuil1_percent + res.seuil2_percent + res.seuil3_percent) / 100);

            return (
              <div key={index} className="print-chart">
                <h3>{reportcatalogue.description}</h3>

                {isImageChart ? (
                  <RadarChartImage chartData={{ labels, data, labelImages }} />
                ) : (
                  <RadarChart chartData={{ labels, data }} />
                )}
              </div>
            );
          })}
        </div>
        <div className="print-footer">
          <div id="print-footer-1">{pdflayout.footer_message1}</div>
          <div id="print-footer-2">{pdflayout.footer_message2}</div>
        </div>
      </div>
    </div>
  );
};

export default PDFComponent;
