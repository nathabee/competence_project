import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RadarChart from './RadarChart';
import RadarChartImage from './RadarChartImage';
import '@/styles/pdf.css';
import PrintHeader from './PrintHeader';
import { Report } from '@/types/report';
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';
import { PDFLayout } from '@/types/pdf';
import ScoreOverview from './ScoreOverview'; // Import ScoreOverview
import SummaryDetailedDifficulty from './SummaryDetailedDifficulty'; // Import summary component

interface PDFComponentProps {
    report: Report;
    eleve: Eleve;
    professor: User;
    pdflayout: PDFLayout;
    isImageChart?: boolean;
}

const PDFComponent: React.FC<PDFComponentProps> = ({
    report,
    eleve,
    professor,
    pdflayout,
    isImageChart,
}) => {
    const reportCatalogues = report.report_catalogues;

    const handlePrintPDF = async () => {
        const printButton = document.querySelector('.btn') as HTMLElement;
        if (printButton) printButton.style.display = 'none';

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Generate pages for each reportCatalogue
        for (let i = 0; i < reportCatalogues.length; i++) {
            const chartSection = document.getElementById(`printable-chart-${i}`);
            if (chartSection) {
                await html2canvas(chartSection, { scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/jpeg', 0.5); // Use JPEG format with lower quality (0.5 = 50%)
                    const imgWidth = 210;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                    // Add new page except for the last graph
                    if (i < reportCatalogues.length - 1) {
                        doc.addPage();
                    }
                });
            }
        }



        const printableElements = Array.from(document.querySelectorAll('[id^="printable-summary-"]'));

        for (let i = 0; i < printableElements.length; i++) {
            const section = printableElements[i] as HTMLElement;
            if (section) {

                doc.addPage();
                await html2canvas(section, { scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/jpeg', 0.5); // Lower quality for compression
                    const imgWidth = 210; // PDF width in mm
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                });
            }
        }

        // Restore print button
        if (printButton) printButton.style.display = 'inline-block';

        const todayFormat = new Date().toISOString().slice(0, 19).replace(/T/, '_').replace(/:/g, '-');
        doc.save(`report_${eleve.nom}__${eleve.prenom}_${todayFormat}.pdf`);
    };



    // Pre-calculate the labels, labelImages, and data once
    const processedData = reportCatalogues.map((reportcatalogue) => {
        const labels = reportcatalogue.resultats.map((res) => res.groupage.label_groupage);

        const labelImages = reportcatalogue.resultats.map((res) => {
            const imageKey = `competence_icon_${res.groupage.groupage_icon_id}`;
            const base64Data = localStorage.getItem(imageKey);
            //return base64Data ? base64Data : 'assets/logo.png'; // Default image if Base64 not found
            return base64Data ? base64Data :  `${process.env.NEXT_PUBLIC_MEDIA_URL}competence/png/logo.png`; // Default image if Base64 not found
           
        });

        const data = reportcatalogue.resultats.map((res) =>
            (res.seuil1_percent + res.seuil2_percent + res.seuil3_percent) / 100
        );

        return {
            description: reportcatalogue.catalogue.description,
            labels,
            labelImages,
            data,
        };
    });

    return (
        <div>
            <button onClick={handlePrintPDF} className="button-warning">
                Imprimer PDF
            </button>

            {/* Generate pages for each reportCatalogue */}
            {processedData.map((chartData, index) => (
                <div key={index} id={`printable-chart-${index}`} className="print-container">
                    {/* Same structure for all pages */}
                    <PrintHeader layout={pdflayout} professor={professor} eleve={eleve} report={report} />
                    <div className="print-banner"><div></div></div>
                    <h3>{chartData.description}</h3>
                    {isImageChart ? ( 
                        <RadarChartImage chartData={{ labels: chartData.labels, data: chartData.data, labelImages: chartData.labelImages }} /> 
                    ) : ( 
                        <RadarChart chartData={{ labels: chartData.labels, data: chartData.data }} /> 
                    )}
                    <ScoreOverview reportCatalogue={reportCatalogues[index]} />
                    <div className="print-footer">
                        <div className="print-footer-message1">{pdflayout.footer_message1}</div>
                        <div className="print-footer-message2">{pdflayout.footer_message2}</div>
                    </div>
                </div>
            ))}

            <div className="spacing"></div> {/* This div creates space between sections */}
        
            {/* Last Page: PrintHeader + SummaryDetailedDifficulty */}
            <SummaryDetailedDifficulty eleve={eleve} professor={professor} pdflayout={pdflayout} report={report} max_item={40} self_page={false} />
        </div>
    );
};

export default PDFComponent;
