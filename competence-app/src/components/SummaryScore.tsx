'use client'; // Ensure client-side rendering

import React from 'react';
import Image from 'next/image'; // Import the Image component from next/image
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure proper import of interfaces
import { useAuth } from '@/context/AuthContext'; // Correctly using the context hook
import '@/app/globals.css';
import logo from  "@/assets/logo.png";
import useTranslation from '@/utils/translationHelper';

// Define the props type with an array of ReportCatalogue
interface SummaryScoreProps {
  report_catalogues: ReportCatalogue[]; // Array of ReportCatalogue[]
}

const SummaryScore: React.FC<SummaryScoreProps> = ({ report_catalogues }) => {
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
              reportCatalogue.resultats.map((resultat: Resultat, resIndex: number) => {
                // Construct the image key from the groupage_icon
                const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`; // Updated key construction for consistency

                // Retrieve the Base64 image data from local storage
                const base64Image = localStorage.getItem(imageKey) || null;

                return (
                  <tr key={`${reportCatalogueIndex}-${resIndex}`}>
                    <td>{reportCatalogue.catalogue.description}</td>
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
                        src={base64Image ? `${base64Image}` : logo} // Use Base64 image if available, otherwise default image
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

// Helper function to calculate "avancement" (progress)
const calculateAvancement = (resultat: Resultat) => {
  // Sum the three percentage thresholds and divide by 3 for progress calculation
  return (resultat.seuil1_percent + resultat.seuil2_percent + resultat.seuil3_percent) / 3;
};

export default SummaryScore;
