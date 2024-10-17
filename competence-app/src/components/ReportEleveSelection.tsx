'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Report } from '@/types/report';
import { Eleve } from '@/types/eleve';
import FullReportDisplay from '@/components/FullReportDisplay'; // Import the new component

interface ReportEleveSelectionProps {
  eleve: Eleve;
}

const ReportEleveSelection: React.FC<ReportEleveSelectionProps> = ({ eleve }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false); // State for expanding/collapsing all reports

  const { setActiveReport } = useAuth(); // Access the setActiveReport function from AuthContext

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

  const handleSelectReport = (report: Report) => {
    toggleExpand(); //hide reports
    setActiveReport(report); // Set the clicked report as the activeReport
  };

  // Function to toggle the expanded state for all reports
  const toggleExpand = () => setExpanded(!expanded);

  if (loading) {
    return <p>Chargement des rapports...</p>;
  }

  return (
    <div>
      <button onClick={toggleExpand}>{expanded ? 'Cacher' : 'Montrer'}</button>

      {expanded && (
        <div>
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="shadow-container">
                <button className="button-warning" onClick={() => handleSelectReport(report)}>
                  Sélectionner ce rapport
                </button>
                <FullReportDisplay report={report} />
              </div>
            ))
          ) : (
            <p>Pas de rapport de tests trouvé pour cet élève.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportEleveSelection;
