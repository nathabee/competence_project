import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Report } from '@/types/report';
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to manage state
import { Eleve } from '@/types/eleve'; // Assuming you have a type for Eleve

interface ReportEleveSelectionProps {
  eleve: Eleve; // Add the eleve prop of type Eleve
}

const ReportEleveSelection: React.FC<ReportEleveSelectionProps> = ({ eleve }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { setActiveEleve } = useAuth(); // Get setter from AuthContext
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = document.cookie.split('authToken=')[1];

        const response = await axios.get(`${apiUrl}/eleve/${eleve.id}/reports/`, { // Use eleve.id to fetch reports
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
  }, [eleve]); // Use eleve as a dependency

  const toggleExpand = () => setExpanded(!expanded);
  
  // Define createReport function to handle redirection and set activeEleve
  const createReport = () => {
    setActiveEleve(eleve); // Set the active eleve
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeEleve', JSON.stringify(eleve)); // Store selected activeEleve
    }
    router.push('/test'); // Redirect to the /test page
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (!expanded) {
    return (
      <div>
        <button onClick={toggleExpand}>Show Reports</button>
        <button onClick={createReport}>New Report</button> {/* New Report button */}
      </div>
    );
  }

  return (
    <div>
      <button onClick={toggleExpand}>{expanded ? 'Hide Reports' : 'Show Reports'}</button>
      {reports.length > 0 ? (
        <div>
          {reports.map((report) => (
            <div key={report.id} className="card mt-3">
              <div className="card-body">
                <h4>Report ID: {report.id}</h4>
                <p>Professeur ID: {report.professeur}</p>
                <p>Date Created: {new Date(report.created_at).toLocaleString()}</p>
                
                <p>PDF Layout ID: {report.pdflayout}</p>

                <h5>Catalogues:</h5>
                <ul>
                  {report.report_catalogues.map((catalogue) => (
                    <li key={catalogue.id}>
                      {catalogue.catalogue_desc.description} (Catalogue ID: {catalogue.catalogue})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reports found for this élève.</p>
      )}
    </div>
  );
};

export default ReportEleveSelection;
