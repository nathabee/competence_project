// src/components/FullReportDisplay.tsx

'use client';

import React, { useState } from 'react';
import { Report } from '@/types/report';
import { formatDate } from  '@/utils/helper';  
import useTranslation from '@/utils/translationHelper';

interface FullReportDisplayProps {
  report: Report; // Accept the full report as a prop
}

const FullReportDisplay: React.FC<FullReportDisplayProps> = ({ report }) => {
  const [expandedFR, setExpandedFR] = useState<boolean>(false);
  const  t  = useTranslation();

  const toggleExpandFR = () => {
    setExpandedFR(!expandedFR);
  };

  return (
    <div className="report-card">
      <div className="card-header" onClick={toggleExpandFR} style={{ cursor: 'pointer'}}> {/*}, backgroundColor: expandedFR ? '#f0f0f0' : '#ffffff' }}>  */}
        <h4>{t('tbH_rptId')}: {report.id}</h4> 
        <p>{t('tbH_profid')}: {report.professeur}</p>
        <p>{t('tbH_createdAt')}: {formatDate(report.created_at)}</p>
        <p>{t('pgH_confMgmt')}: {report.pdflayout}</p>
        {expandedFR ? '▲' : '▼'} {/* Arrow to indicate expand/collapse */}
      </div>

      {expandedFR && (
        <div className="card-body">
          <h5>{t('tbH_typeTest')}:</h5>
          <ul>
            {report.report_catalogues.map((catalogue) => (
              <li key={catalogue.id}>
                {catalogue.catalogue.description}
                <ul>
                  {catalogue.resultats.map((resultat) => (
                    <li key={resultat.id}>
                      {t('tbH_ctgTest')}: {resultat.groupage.desc_groupage}  {t('tbH_MaxScore')}: {Math.round(resultat.groupage.max_point)}   ({Math.round(resultat.seuil1_percent)}%/{Math.round(resultat.seuil2_percent)}%/{Math.round(resultat.seuil3_percent)}%)
                      <ul>
                        {resultat.resultat_details.map((detail) => (
                          <li key={detail.id}>
                            {t('tbH_test')}: {detail.item.description}, {t('tbH_score')}: {Math.round(detail.score)}/ {t('tbH_MaxScore')}: {Math.round(detail.item.max_score)} , {t('tbH_Label')}: {detail.scorelabel}, {t('tbH_Desc')}: {detail.observation}
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
