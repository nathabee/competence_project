'use client';

import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RadarChart from './RadarChart';
import PrintHeader from './PrintHeader';
import { ReportCatalogue } from '@/types/report';
import {  Eleve } from '@/types/eleve';
import { User } from '@/types/user';
import { PDFLayout } from '@/types/pdf';

interface PDFComponentProps {
  reportCatalogues: ReportCatalogue[];  // ReportCatalogues data
  eleve: Eleve;                         // Student data
  professor: User;                      // Professor data
  config: PDFLayout;                    // PDF layout configuration
}

const PDFComponent: React.FC<PDFComponentProps> = ({ reportCatalogues, eleve, professor, config }) => {

  const handlePrintPDF = () => {
    const printButton = document.querySelector('.btn');
    if (printButton) printButton.style.display = 'none'; // Hide print button during capture

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const printableSection = document.getElementById('printable-section-1');

    if (!printableSection) return;

    html2canvas(printableSection, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // Full A4 page size
      if (printButton) printButton.style.display = 'inline-block'; // Show the button again
      doc.save('report.pdf');
    });
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handlePrintPDF}>Imprimer PDF</button>
      <div id="printable-section-1" className="print-container">
        <PrintHeader config={config} />
        
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
          <h2>Résultats de l'évaluation :</h2>
          {reportCatalogues.map((catalogue, index) => {
            const labels = catalogue.resultats.map(res => res.groupage.label_groupage);
            const data = catalogue.resultats.map(res => res.score);

            return (
              <div key={index} className="print-chart">
                <h3>{catalogue.description}</h3>
                <RadarChart 
                  matiere={catalogue.description} 
                  chartData={{ labels, data }} 
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="print-footer">
          <h4>{config.footer_message}</h4>
        </div>
      </div>
    </div>
  );
};

export default PDFComponent;
