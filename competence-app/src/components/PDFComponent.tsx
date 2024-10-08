'use clinet';


import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RadarChart from './RadarChart';
import '@/styles/pdf.css'; // Import global styles
import PrintHeader from './PrintHeader';
import { ReportCatalogue } from '@/types/report';
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';
import { PDFLayout } from '@/types/pdf';

interface PDFComponentProps {
  reportCatalogues: ReportCatalogue[];  // ReportCatalogues data
  eleve: Eleve;                         // Student data
  professor: User;                      // Professor data
  pdflayout: PDFLayout;                    // PDF layout configuration
}

const PDFComponent: React.FC<PDFComponentProps> = ({ reportCatalogues, eleve, professor, pdflayout }) => {

  const handlePrintPDF = () => {
    const printButton = document.querySelector('.btn') as HTMLElement; // Cast to HTMLElement to access style
    if (printButton) printButton.style.display = 'none'; // Hide print button during capture

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const printableSection = document.getElementById('printable-section-1');
    if (!printableSection) return;

    html2canvas(printableSection, { scale: 2 }).then((canvas: HTMLCanvasElement) => { // Define canvas type as HTMLCanvasElement
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // Full A4 page size

      if (printButton) printButton.style.display = 'inline-block'; // Show the button again
      doc.save('report.pdf');
    });
  };

  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
      <button className="btn btn-primary" onClick={handlePrintPDF}>Imprimer PDF</button>
      <div id="printable-section-1" className="print-container">
        <PrintHeader layout={pdflayout} />
        
        {/* Student and Professor Information */}
        <div className="print-banner">
          <div className="print-banner-col">
            <h4>Professeur:</h4>
            <p>Nom: {professor.last_name}</p>
            <p>Prénom: {professor.first_name}</p>
          </div>
          <div className="print-banner-col">
            <h4>Élève:</h4>
            <p>Nom: {eleve.nom}</p>
            <p>Prénom: {eleve.prenom}</p>
            <p>Niveau: {eleve.niveau}</p>
          </div>
        </div>

        {/* Radar Charts */}
        <div className="print-charts">
          <h2>{pdflayout.header_message}</h2>
          {reportCatalogues.map((catalogue, index) => {
            const labels = catalogue.resultats.map(res => res.groupage.label_groupage);
            const data = catalogue.resultats.map(res => (res.seuil1_percent +  res.seuil2_percent+ res.seuil3_percent) / 100 );

            return (
              <div key={index} className="print-chart">
                <h3>{catalogue.description}</h3>
                <RadarChart 
                  chartData={{ labels, data }} 
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="print-footer">
          <p>{pdflayout.footer_message1}</p>
          <p>{pdflayout.footer_message2}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFComponent;
