'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
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
  //const router = useRouter();

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


  // Function to toggle the expanded state for all reports
  const toggleExpand = () => setExpanded(!expanded);

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div>
      <button onClick={toggleExpand}>{expanded ? 'Hide All Reports' : 'Show All Reports'}</button>

      {expanded && (
        <div>
          {reports.length > 0 ? (
            reports.map((report) => (
              <FullReportDisplay key={report.id} report={report} /> // Use the FullReportDisplay component
            ))
          ) : (
            <p>No reports found for this élève.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportEleveSelection;
