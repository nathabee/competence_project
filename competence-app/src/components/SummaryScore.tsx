'use client'; // Ensure client-side rendering

import React from 'react';
import Image from 'next/image'; // Import the Image component from next/image
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure proper import of interfaces
import { useAuth } from '@/context/AuthContext'; // Correctly using the context hook
import '@/app/globals.css';

// Define the props type with an array of ReportCatalogue
interface SummaryScoreProps {
  report_catalogues: ReportCatalogue[]; // Array of ReportCatalogue[]
}

const SummaryScore: React.FC<SummaryScoreProps> = ({ report_catalogues }) => {
  // Use AuthContext to get the active report directly
  const { activeReport } = useAuth();

  // Use activeReport if available, otherwise fallback to passed props
  const cachedReport = activeReport ? activeReport.report_catalogues : report_catalogues;

  return (
    <div> 
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Catalogue</th>
            <th>Groupage</th>
            <th>Total score</th>
            <th>Max score</th>
            <th>Compétence acquise</th>
            <th>Avancement</th>
            <th>seuil1_percent</th>
            <th>seuil2_percent</th>
            <th>seuil3_percent</th>
            <th>icône</th>
          </tr>
        </thead>
        <tbody>
          {cachedReport && cachedReport.length > 0 ? (
            cachedReport.map((reportCatalogue: ReportCatalogue, reportCatalogueIndex: number) => (
              reportCatalogue.resultats.map((resultat: Resultat, resIndex: number) => {
                // Construct the image key from the groupage_icon
                const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`; // Updated key construction for consistency

                // Retrieve the Base64 image data from local storage
                const base64Image = localStorage.getItem(imageKey) || null;

                return (
                  <tr key={`${reportCatalogueIndex}-${resIndex}`}>
                    <td>{reportCatalogue.description}</td>
                    <td>{resultat.groupage.label_groupage}</td>
                    <td>{resultat.score.toFixed(2)}</td>
                    <td>{resultat.groupage.max_point.toFixed(2)}</td>
                    <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td>
                    <td>{calculateAvancement(resultat).toFixed(2)}</td>
                    <td>{resultat.seuil1_percent}</td>
                    <td>{resultat.seuil2_percent}</td>
                    <td>{resultat.seuil3_percent}</td>
                    <td>
                      <Image
                        src={base64Image ? `${base64Image}` : "../assets/logo.png"} // Use Base64 image if available, otherwise default image
                        alt={base64Image ? "Groupage Icon" : "Default Icon"} // Update alt text accordingly
                        width={50} // Set width
                        height={50} // Set height
                        style={{ marginRight: '10px' }} // Inline styles for margin
                      />
                    </td>
                  </tr>
                );
              })
            ))
          ) : (
            <tr>
              <td colSpan={10}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to calculate "avancement" (progress)
const calculateAvancement = (resultat: Resultat) => {
  // Sum the three percentage thresholds and divide by 3 for progress calculation
  return (resultat.seuil1_percent + resultat.seuil2_percent + resultat.seuil3_percent) / 3;
};

export default SummaryScore;
