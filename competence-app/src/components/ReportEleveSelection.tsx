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
  const { catalogue, setActiveReport, setActiveCatalogues, layouts, setActiveLayout } = useAuth(); // Access the functions from AuthContext


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
    //toggleExpand(); // Hide reports
    setExpanded(false);

    // Step 1: Extract catalogue IDs from the report's report_catalogues
    const catalogueIds = report.report_catalogues.map(reportCatalogue => reportCatalogue.catalogue.id);
    console.log("catalogueIds in the report",catalogueIds)
    console.log("catalogue from context",catalogue)
    console.log("Type of catalogueIds:", catalogueIds.map(id => typeof id));
    console.log("Type of catalogue IDs in context:", catalogue.map(cat => typeof cat.id));

    // Step 2: Find the corresponding catalogue objects in the context
    const selectedCatalogues = catalogue.filter(cat => catalogueIds.includes(cat.id));

    // Step 3: Update the active catalogues
    setActiveCatalogues(selectedCatalogues);

    // Step 4: Check if the size of activeCatalogues matches the report's report_catalogues length
    if (selectedCatalogues.length !== report.report_catalogues.length) {
      console.error(`Mismatch in catalogues: Expected ${report.report_catalogues.length} but found ${selectedCatalogues.length}. Looking for IDs: ${catalogueIds.join(", ")}.`);
    }

    // Step 5: Find the layout object that matches the report's pdflayout id
    const selectedLayout = layouts.find(layout => layout.id === report.pdflayout);

    console.log(" layout.id in the report", report.pdflayout)
    //console.log("layouts from context",layouts)

    // Step 6: Update the active layout in the context
    if (selectedLayout) {
      setActiveLayout(selectedLayout); // Set the found layout as the activeLayout
    } else {
      console.error(`No matching layout found for ID: ${report.pdflayout}. Report ID: ${report.id}`);
    }

    // Step 7: Additional validation to ensure the layout and activeLayout sizes match
    const activeLayoutsCount = layouts.filter(layout => layout.id === report.pdflayout).length;
    if (activeLayoutsCount === 0) {
      console.error(`Expected layout for ID ${report.pdflayout} not found in context. Report ID: ${report.id}`);
    }

    console.log("setActiveReport will be called",report)
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
