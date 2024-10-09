'use client';

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
  reportCatalogues: ReportCatalogue[];
  eleve: Eleve;
  professor: User;
  pdflayout: PDFLayout;
}

const PDFComponent: React.FC<PDFComponentProps> = ({ reportCatalogues, eleve, professor, pdflayout }) => {

 
  const handlePrintPDF = async () => {
    const printButton = document.querySelector('.btn') as HTMLElement;
    if (printButton) printButton.style.display = 'none';
  
    const printableSection = document.getElementById('printable-section-1');
    if (!printableSection) return;
  
    // Use the Base64 image directly
    // const imgData = pdflayout.header_icon_base64; // Assuming this contains the Base64 string
  
    // Use a higher scale for better quality
    html2canvas(printableSection, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
      const sectionImgData = canvas.toDataURL('image/png');
      console.log("Canvas data URL created:", sectionImgData); // Log the data URL
  
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      // Check if the jsPDF instance was created
      if (doc) {
        console.log("jsPDF instance created successfully.");
      }
  
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  
      // Attempt to add the section canvas image to the PDF
      try {
        doc.addImage(sectionImgData, 'PNG', 0, 0, imgWidth, imgHeight);
        console.log("Section image added to PDF successfully.");
      } catch (error) {
        console.error("Failed to add section image to PDF:", error); // Log if adding the image fails
      }
  
      /*
      // Attempt to add the header icon to the PDF as well
      try {
        const headerIconWidth = 50; // Adjust as needed
        const headerIconHeight = 50; // Adjust as needed
        doc.addImage(imgData, 'PNG', 10, 10, headerIconWidth, headerIconHeight); // Adjust the position
        console.log("Header icon added to PDF successfully.");
      } catch (error) {
        console.error("Failed to add header icon to PDF:", error); // Log if adding the header icon fails
      }
  
      // Optional: add more configurations for better quality (like font settings)
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      */
  
      if (printButton) printButton.style.display = 'inline-block';
      doc.save('report_high_quality.pdf');
    }).catch((error) => {
      console.error("html2canvas failed:", error); // Log if html2canvas fails
    });
  };
  



  return (
    <div>
      <button className="btn btn-primary" onClick={handlePrintPDF}>Imprimer PDF</button> 
      <div id="printable-section-1" className="print-container">
        <PrintHeader layout={pdflayout} />
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
        <div className="print-charts">
          <h2>{pdflayout.header_message}</h2>
          {reportCatalogues.map((catalogue, index) => {
            const labels = catalogue.resultats.map(res => res.groupage.label_groupage);
            const data = catalogue.resultats.map(res => (res.seuil1_percent + res.seuil2_percent + res.seuil3_percent) / 100);
            return (
              <div key={index} className="print-chart">
                <h3>{catalogue.description}</h3>
                <RadarChart chartData={{ labels, data }} />
              </div>
            );
          })}
        </div>
        <div className="print-footer">
          <p>{pdflayout.footer_message1}</p>
          <p>{pdflayout.footer_message2}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFComponent;
