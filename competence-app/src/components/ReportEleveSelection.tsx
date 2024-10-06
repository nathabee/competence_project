'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Report } from '@/types/report';
import { useAuth } from '@/context/AuthContext';
import { Eleve } from '@/types/eleve';

interface ReportEleveSelectionProps {
  eleve: Eleve;
}

const ReportEleveSelection: React.FC<ReportEleveSelectionProps> = ({ eleve }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { activeEleve, setActiveEleve, user, activeCatalogues, setActiveReport } = useAuth(); // Include setActiveReport
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = document.cookie.split('authToken=')[1];

        const response = await axios.get(`${apiUrl}/eleve/${eleve.id}/reports/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [eleve]);

  const toggleExpand = () => setExpanded(!expanded);

  const createReport = async () => {
    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    setActiveEleve(eleve);

    if (typeof window !== 'undefined') {
      localStorage.setItem('activeEleve', JSON.stringify(eleve));
    }

    if (!activeCatalogues || activeCatalogues.length === 0) {
      console.error('Active catalogues are not set or empty.');
      return; // Prevent API call if activeCatalogues is not valid
    }

    try {
      const catalogueIds = activeCatalogues.map(cat => cat.id);

      const reportCreationResponse = await axios.post(`${apiUrl}/fullreports/`, {
        eleve: activeEleve?.id,
        professeur: user?.id,
        pdflayout: 1,
        catalogue_ids: catalogueIds,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdReport = reportCreationResponse.data;

      // Set the created report as active in the context
      setActiveReport(createdReport);

      router.push(`/test/page?id=${createdReport.id}`);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report);
  };

  const modifyReport = () => {
    if (selectedReport) {
      // Set the selected report as active in the context
      setActiveReport(selectedReport);
      
      router.push(`/test/page?id=${selectedReport.id}`);
    }
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div>
      <button onClick={toggleExpand}>{expanded ? 'Hide Reports' : 'Show Reports'}</button>
      <button onClick={createReport}>New Report</button>

      {expanded && (
        <div>
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="card mt-3">
                <div className="card-body">
                  <h4>Report ID: {report.id}</h4>
                  <p>Professeur ID: {report.professeur}</p>
                  <p>Created At: {new Date(report.created_at).toLocaleString()}</p>
                  <p>PDF Layout ID: {report.pdflayout}</p>

                  <h5>Catalogues:</h5>
                  <ul>
                    {report.report_catalogues.map((catalogue) => (
                      <li key={catalogue.id}>
                        {catalogue.description}
                        <ul>
                          {catalogue.resultats.map((resultat) => (
                            <li key={resultat.id}>
                              Groupage: {resultat.groupage.desc_groupage}
                              <ul>
                                {resultat.resultat_details.map((detail) => (
                                  <li key={detail.id}>
                                    Item: {detail.item.description}, Score: {detail.score}, Label: {detail.scorelabel}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => handleReportSelect(report)}>Select</button>
                </div>
              </div>
            ))
          ) : (
            <p>No reports found for this élève.</p>
          )}
          {selectedReport && (
            <div>
              <button onClick={modifyReport}>Change</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportEleveSelection;
