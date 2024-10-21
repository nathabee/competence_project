'use client'; // Ensure client-side rendering

import React from 'react';
import Image from 'next/image'; // Import the Image component from next/image
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure proper import of interfaces
import { useAuth } from '@/context/AuthContext'; // Correctly using the context hook
import '@/styles/pdf.css';

// Define the props type with an array of ReportCatalogue
interface SummaryDetailedDifficultyProps {
  report_catalogues: ReportCatalogue[]; // Array of ReportCatalogue[]
}

const SummaryDetailedDifficulty: React.FC<SummaryDetailedDifficultyProps> = ({ report_catalogues }) => {
  // Use AuthContext to get the active report directly
  const { activeReport } = useAuth();

  // Use activeReport if available, otherwise fallback to passed props
  const cachedReport = activeReport ? activeReport.report_catalogues : report_catalogues;

  return (
    <div> 
      <table className="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>Type de tests</th>
            <th>Score</th>
            <th>Max score</th>
            <th>Avancement</th> 
            <th>seuil1</th>
            <th>seuil2</th>
            <th>seuil3</th> 
          </tr>
        </thead>
        <tbody>
          {cachedReport && cachedReport.length > 0 ? (
            cachedReport.map((reportCatalogue: ReportCatalogue, reportCatalogueIndex: number) => (
              reportCatalogue.resultats
                // Apply filtering rules for displaying results
                .filter((resultat: Resultat) => resultat.seuil2_percent < 100 || resultat.seuil1_percent < 100)
                .map((resultat: Resultat, resIndex: number) => {
                  // Construct the image key from the groupage_icon
                  const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`; // Updated key construction for consistency

                  // Retrieve the Base64 image data from local storage
                  const base64Image = localStorage.getItem(imageKey) || null;

                  // Determine if the row should be bold (seuil1_percent < 100)
                  const isBold = resultat.seuil1_percent < 100;

                  return (
                    <React.Fragment key={`${reportCatalogueIndex}-${resIndex}`}>
                      <tr style={isBold ? { fontWeight: 'bold' } : {}}>
                        <td>{base64Image ? (
                          <Image
                            src={`${base64Image}`} 
                            alt="Groupage Icon"
                            width={20} // Set width
                            height={20} // Set height
                            style={{ marginRight: '10px' }} // Inline styles for margin
                          />
                          ) : ("")}{reportCatalogue.description}</td>
                        <td>{resultat.groupage.label_groupage}</td>
                        <td>{resultat.score.toFixed(0)}</td>
                        <td>{resultat.groupage.max_point.toFixed(0)}</td>
                        <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td> 
                        <td>{Math.round(resultat.seuil1_percent)}%</td>
                        <td>{Math.round(resultat.seuil2_percent)}%</td>
                        <td>{Math.round(resultat.seuil3_percent)}%</td>  
                      </tr>
                      {/* Check for detailed errors if seuil2_percent < 100 */}
                      {resultat.seuil2_percent < 100 && resultat.resultat_details && (
                        resultat.resultat_details.map((detail, detailIndex) => {
                          // Check if the test is in error
                          const testInError = (detail.score * 2) < detail.item.max_score;

                          // Render test details if in error
                          return testInError ? (
                            <tr key={`${reportCatalogueIndex}-${resIndex}-detail-${detailIndex}`} style={{ fontWeight: 'normal' }}>
                              <td colSpan={2} style={{ paddingLeft: '30px' }}> {/* Indentation for clarity */}
                                {detail.item.description}
                              </td>
                              <td>{Math.round(detail.score)}</td>
                              <td>{detail.item.max_score}</td>
                              <td>{detail.observation}</td>
                              <td colSpan={3}></td> {/* Empty cells for alignment */}
                            </tr>
                          ) : null;
                        })
                      )}
                    </React.Fragment>
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

export default SummaryDetailedDifficulty;
