// src/components/SummaryData.tsx
'use client'; // Ensure client-side rendering

import React from 'react';
import { ReportCatalogue, Resultat } from '@/types/report'; // Ensure proper import of interfaces
import '@/app/globals.css';

// Define the props type with an array of ReportCatalogue
interface SummaryScoreProps {
  report_catalogues: ReportCatalogue[]; // Array of ReportCatalogue[]
}

const SummaryScore: React.FC<SummaryScoreProps> = ({ report_catalogues }) => {
  return (
    <div>
      <h2 className="section-title">Résumé des Catalogues</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Catalogue</th>
            <th>Groupage</th>
            <th>Total score</th>
            <th>Max score</th>
            <th>Competence acquise</th>
            <th>Avancement</th>
          </tr>
        </thead>
        <tbody>
          {report_catalogues && report_catalogues.length > 0 ? (
            report_catalogues.map((reportCatalogue: ReportCatalogue, reportCatalogueIndex: number) => (
              reportCatalogue.resultats.map((resultat: Resultat, resIndex: number) => (
                <tr key={`${reportCatalogueIndex}-${resIndex}`}>
                  <td>{reportCatalogue.description}</td>
                  <td>{resultat.groupage.label_groupage}</td>
                  <td>{resultat.score.toFixed(2)}</td>
                  <td>{resultat.groupage.max_point.toFixed(2)}</td>
                  <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td>
                  <td>{calculateAvancement(resultat).toFixed(2)}</td>
                </tr>
              ))
            ))
          ) : (
            <tr>
              <td colSpan={6}>No data available</td>
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
