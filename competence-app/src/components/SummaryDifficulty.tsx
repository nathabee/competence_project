'use client'; // Ensure client-side rendering

import React from 'react';
import Image from 'next/image'; // Import the Image component from next/image
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure proper import of interfaces
import { useAuth } from '@/context/AuthContext'; // Correctly using the context hook
import '@/app/globals.css';
import logo from  "@/assets/logo.png";
import useTranslation from '@/utils/translationHelper';

// Define the props type with an array of ReportCatalogue
interface SummaryDifficultyProps {
  report_catalogues: ReportCatalogue[]; // Array of ReportCatalogue[]
}

const SummaryDifficulty: React.FC<SummaryDifficultyProps> = ({ report_catalogues }) => {
  // Use AuthContext to get the active report directly
  const { activeReport } = useAuth();
  const  t  = useTranslation();

  // Use activeReport if available, otherwise fallback to passed props
  const cachedReport = activeReport ? activeReport.report_catalogues : report_catalogues;

  return (
    <div> 
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>{t('tbH_CatalogTest')}</th>
            <th>{t('tbH_ctgTest')}</th>
            <th>{t('tbH_scoreTotal')}</th>
            <th>{t('tbH_MaxScore')}</th>
            <th>{t('tbH_compet')}</th> 
            <th>{t('tbH_Seuil1')}</th>
            <th>{t('tbH_Seuil2')}</th>
            <th>{t('tbH_Seuil3')}</th>
            <th>{t('tbH_icon')}</th>
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
                    <tr key={`${reportCatalogueIndex}-${resIndex}`} style={isBold ? { fontWeight: 'bold' } : {}}>
                      <td>{reportCatalogue.catalogue.description}</td>
                      <td>{resultat.groupage.label_groupage}</td>
                      <td>{resultat.score.toFixed(2)}</td>
                      <td>{resultat.groupage.max_point.toFixed(2)}</td>
                      <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td> 
                      <td>{Math.round(resultat.seuil1_percent)}%</td>
                      <td>{Math.round(resultat.seuil2_percent)}%</td>
                      <td>{Math.round(resultat.seuil3_percent)}%</td>
                      <td>
                        <Image
                          src={base64Image ? `${base64Image}` : logo } // Use Base64 image if available, otherwise default image
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
              <td colSpan={10}>{t('msg_noData')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryDifficulty;
