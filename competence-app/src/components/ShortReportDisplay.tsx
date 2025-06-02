'use client';

import React, { useState } from 'react';
import { ShortReport, ShortReportCatalogue } from '@/types/shortreport';
import useTranslation from '@/utils/translationHelper';

interface ShortReportDisplayProps {
  reports: ShortReport[];
}

interface ShortReportCatalogueDisplayProps {
  reportCatalogue: ShortReportCatalogue;
  isNegativeSeuil: boolean;  // Receive whether the catalogue has a negative seuil
}

const ShortReportDisplay: React.FC<ShortReportDisplayProps> = ({ reports }) => {
  const  t  = useTranslation();
  // Check for negative seuils in the report's catalogues
  const hasNegativeSeuil = (report: ShortReport): boolean => {
    return report.report_catalogues.some(catalogue =>
      catalogue.resultats.some(
        result => result.seuil1_percent < 0 || result.seuil2_percent < 0 || result.seuil3_percent < 0
      )
    );
  };

  return (
    <div className="tab-content mt-3">
      {reports.length > 0 ? (
        reports.map((report) => {
          const isNegativeSeuil = hasNegativeSeuil(report); // Check for negative seuil in the current report

          return (
            <div key={report.id} className="report-card mb-3">
              <h5 style={{ color: isNegativeSeuil ? 'var(--custom-alert)' : 'inherit' }}>
              {t('tbH_rptId')}: {report.id} | {t('pdf_stdt')}: {report.eleve.prenom} {report.eleve.nom} {report.eleve.niveau}
              </h5>
              <p>
                {report.professeur ? (
                  <span>
                    {t('pdf_prof')}: {report.professeur.first_name} {report.professeur.last_name}
                  </span>
                ) : (
                  <span>{t('msg_noProf')}</span>
                )}
                <br />
                {t('pdf_rptCreatDt')}: {new Date(report.created_at).toLocaleString()} | {t('pdf_UpdDt')}: {new Date(report.updated_at).toLocaleString()}
              </p>

              {/* Report Catalogues */}
              <div className="report-catalogues"> 
                <div>
                  {report.report_catalogues.length > 0 ? (
                    report.report_catalogues.map(catalogue => (
                      <ReportCatalogueDisplay
                        key={catalogue.id}
                        reportCatalogue={catalogue}
                        isNegativeSeuil={isNegativeSeuil}
                      />
                    ))
                  ) : (
                    <p>{t('msg_noCtg')}</p>
                  )}
                </div> 
              </div>
            </div>
          );
        })
      ) : (
        <p>{t('msg_noRpt')}</p>
      )}
    </div>
  );
};

// Component to display a single report catalogue and its resultats
const ReportCatalogueDisplay: React.FC<ShortReportCatalogueDisplayProps> = ({ reportCatalogue, isNegativeSeuil }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const  t  = useTranslation();

  return (
    <div className="catalogue-item mb-2">
      <h6
        onClick={() => setIsExpanded(!isExpanded)}
        className={`catalogue-title ${isExpanded ? 'expanded' : ''}`}
        style={{ color: isNegativeSeuil ? 'var(--custom-alert)' : 'inherit' }} // Change color if negative seuil exists
      >
        Test: {reportCatalogue.catalogue} {isExpanded ? '▲' : '▼'}
      </h6>

      {isExpanded && (
        <div className="catalogue-results" style={{ color: isNegativeSeuil ? 'var(--custom-alert)' : 'inherit' }}> 
          {reportCatalogue.resultats.length > 0 ? (
            <ul>
              {reportCatalogue.resultats.map(result => (
                <li key={result.id}>
                  {result.groupage.label_groupage} | {t('tbH_score')}: {Math.round(result.score)}/ {t('tbH_MaxScore')}: {result.groupage.max_point} | {t('tbH_Seuil1')}: {Math.round(result.seuil1_percent)}% | {t('tbH_Seuil2')}: {Math.round(result.seuil2_percent)}% | {t('tbH_Seuil3')}: {Math.round(result.seuil3_percent)}%
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('msg_noData')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortReportDisplay;
