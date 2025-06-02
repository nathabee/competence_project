'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Report, ReportCatalogue, Resultat } from '@/types/report'; // Import your types
import { useAuth } from '@/context/AuthContext';
import '@/styles/pdf.css';
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';
import { PDFLayout } from '@/types/pdf';
import PrintHeader from './PrintHeader';
import useTranslation from '@/utils/translationHelper';

interface SummaryDetailedDifficultyProps {
  eleve: Eleve;
  professor: User;
  pdflayout: PDFLayout;
  report: Report;
  max_item: number;
  self_page: boolean; // New parameter to determine pagination behavior
}

// Define row types
interface MainRow {
  type: 'main';
  reportCatalogue: ReportCatalogue;
  resultat: Resultat;
}

interface DetailRow {
  type: 'detail';
  detail: {
    score: number;
    item: {
      description: string;
      max_score: number;
    };
    observation: string;
  };
}

type Row = MainRow | DetailRow;

const SummaryDetailedDifficulty: React.FC<SummaryDetailedDifficultyProps> = ({
  eleve,
  professor,
  pdflayout,
  report,
  max_item,
  self_page,
}) => {
  const { activeReport } = useAuth();
  const  t  = useTranslation();
  const cachedReport = activeReport ? activeReport.report_catalogues : report.report_catalogues;

  // Flatten results for easier handling
  const flattenedResults: Row[] = cachedReport.flatMap((reportCatalogue: ReportCatalogue) =>
    reportCatalogue.resultats
      .filter((resultat: Resultat) => resultat.seuil2_percent < 100 || resultat.seuil1_percent < 100)
      .flatMap((resultat: Resultat) => {
        const mainRow: MainRow = {
          type: 'main',
          reportCatalogue,
          resultat
        };
        const detailRows: DetailRow[] = resultat.seuil2_percent < 100 && resultat.resultat_details
          ? resultat.resultat_details.map((detail) => ({
            type: 'detail',
            detail
          }))
          : [];
        return [mainRow, ...detailRows];
      })
  );

  // Split into pages of max_item rows
  const paginatedResults: Row[][] = [];
  for (let i = 0; i < flattenedResults.length; i += max_item) {
    paginatedResults.push(flattenedResults.slice(i, i + max_item));
  }

  // State for current page
  const [currentPage, setCurrentPage] = useState(0);

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to go to the next page
  const goToNextPage = () => {
    if (currentPage < paginatedResults.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to render the table based on rows
  const renderTable = (rows: Row[]) => (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th></th>
          <th>{t('tbH_typeTest')}</th>
          <th>{t('tbH_score')}</th>
          <th>{t('tbH_MaxScore')}</th>
          <th>{t('pdf_ChartLabel')}</th>
          <th>{t('tbH_Seuil1')}</th>
          <th>{t('tbH_Seuil2')}</th>
          <th>{t('tbH_Seuil3')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row: Row, rowIndex) => {
          if (row.type === 'main') {
            const { reportCatalogue, resultat } = row; // Now this is properly typed
            const isBold = resultat.seuil1_percent < 100;
            const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`;
            const base64Image = localStorage.getItem(imageKey) || null;

            return (
              <tr key={rowIndex} style={isBold ? { fontWeight: 'bold' } : {}}>
                <td>
                  {base64Image ? (
                    <Image
                      src={`${base64Image}`}
                      alt="Groupage Icon"
                      width={20}
                      height={20}
                      style={{ marginRight: '10px' }}
                    />
                  ) : null}
                  {reportCatalogue.catalogue.description}
                </td>
                <td>{resultat.groupage.label_groupage}</td>
                <td>{resultat.score.toFixed(0)}</td>
                <td>{resultat.groupage.max_point.toFixed(0)}</td>
                <td>{Math.round((resultat.score / resultat.groupage.max_point) * 100)}%</td>
                <td>{Math.round(resultat.seuil1_percent)}%</td>
                <td>{Math.round(resultat.seuil2_percent)}%</td>
                <td>{Math.round(resultat.seuil3_percent)}%</td>
              </tr>
            );
          }

          if (row.type === 'detail') {
            const { detail } = row;
            const testInError = (detail.score * 2) < detail.item.max_score;

            return testInError ? (
              <tr key={`${rowIndex}-detail`} style={{ fontWeight: 'normal' }}>
                <td colSpan={2} style={{ paddingLeft: '30px' }}>{detail.item.description}</td>
                <td>{Math.round(detail.score)}</td>
                <td>{detail.item.max_score}</td>
                <td>{detail.observation}</td>
                <td colSpan={3}></td>
              </tr>
            ) : null;
          }
          return null;
        })}
      </tbody>
    </table>
  );

  // Rendering logic based on self_page
  return (
    <div>
      {self_page ? (
        // Render with pagination
        <>
          <div id={`printable-summary-${currentPage}`} className="print-container">
            <PrintHeader layout={pdflayout} professor={professor} eleve={eleve} report={report} />
            <h2>{t('tbH_detailRptPb')}:</h2>
            {renderTable(paginatedResults[currentPage])}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={goToPreviousPage} disabled={currentPage === 0}>
            {t('nav_back')}
            </button>
            <span>
            {t('nav_page')} {currentPage + 1} {t('nav_of')}sur {paginatedResults.length}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === paginatedResults.length - 1}>
            {t('nav_next')} 
            </button>
          </div>
        </>
      ) : (
        // Render all results without pagination
        <div>
          {Array.from({ length: paginatedResults.length }).map((_, pageIndex) => (
            <div key={pageIndex}>

              <div className="spacing"></div> {/* This div creates space between sections */}
              <div id={`printable-summary-${pageIndex}`} className="print-container">
                <PrintHeader layout={pdflayout} professor={professor} eleve={eleve} report={report} />
                <h2>{t('tbH_detailRptPb')}:</h2>
                {renderTable(paginatedResults[pageIndex])}
              </div>

            </div>
          ))}
        </div>

      )}
    </div>
  );
};

export default SummaryDetailedDifficulty;
