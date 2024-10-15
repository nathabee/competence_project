// src/components/FullReportDisplay.tsx

'use client';

import React, { useState } from 'react';
import { Report } from '@/types/report';
import { formatDate } from '../utils/helper'; 

interface FullReportDisplayProps {
  report: Report; // Accept the full report as a prop
}

const FullReportDisplay: React.FC<FullReportDisplayProps> = ({ report }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="report-card">
      <div className="card-header" onClick={toggleExpand} style={{ cursor: 'pointer'}}> {/*}, backgroundColor: expanded ? '#f0f0f0' : '#ffffff' }}>  */}
        <h4>Report ID: {report.id}</h4>
        <p>Professeur ID: {report.professeur}</p>
        <p>Created At: {formatDate(report.created_at)}</p>
        <p>PDF Layout ID: {report.pdflayout}</p>
        {expanded ? '▲' : '▼'} {/* Arrow to indicate expand/collapse */}
      </div>

      {expanded && (
        <div className="card-body">
          <h5>Catalogues:</h5>
          <ul>
            {report.report_catalogues.map((catalogue) => (
              <li key={catalogue.id}>
                {catalogue.description}
                <ul>
                  {catalogue.resultats.map((resultat) => (
                    <li key={resultat.id}>
                      Categorie de tests: {resultat.groupage.desc_groupage}  maxScore: {resultat.groupage.max_point}   ({resultat.seuil1_percent}%/{resultat.seuil2_percent}%/{resultat.seuil3_percent}%)
                      <ul>
                        {resultat.resultat_details.map((detail) => (
                          <li key={detail.id}>
                            Item: {detail.item.description}, Score: {detail.score}/ maxScore: {detail.item.max_score} , Label: {detail.scorelabel}, Description: {detail.observation}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FullReportDisplay;
