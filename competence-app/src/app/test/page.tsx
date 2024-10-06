'use client'; // Add this line at the top

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { Report, ReportCatalogue, ResultatDetail, ScoreRulePoint } from '@/types/report'; // Adjust the path as needed

const Test: React.FC = () => {
  const router = useRouter();
  const { activeCatalogues, activeEleve, user, scoreRulePoints, setScoreRulePoints, activeReport, setActiveReport } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportCatalogue[]>([]); // Typed as ReportCatalogue

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1]?.split(';')[0];

      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        // Fetch score rule points
        const scoreRuleResponse = await axios.get<ScoreRulePoint[]>(`${apiUrl}/scorerulepoints/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScoreRulePoints(scoreRuleResponse.data); 

        if (!activeCatalogues) {
          throw new Error('No active catalogue selected');
        }

        // Fetch full report using activeReport
        if (activeReport) {
          const fullReportResponse = await axios.get<Report>(`${apiUrl}/fullreports/${activeReport.id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Update activeReport and reportData from the fetched response
          setActiveReport(fullReportResponse.data);
          setReportData(fullReportResponse.data.report_catalogues || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, activeCatalogues, activeReport, setScoreRulePoints, setActiveReport]);

  const handleObservationChange = (resultatIndex: number, detailIndex: number, value: string) => {
    setReportData((prevData) => {
      const newData = [...prevData];
      newData[resultatIndex].resultat_details[detailIndex].observation = value;
      return newData;
    });
  };

  const handleScoreLabelChange = (resultatIndex: number, detailIndex: number, selectedLabel: string, scorerule: number) => {
    const scoreRulePoint = scoreRulePoints?.find(
      (srp) => srp.scorerule === scorerule && srp.scorelabel === selectedLabel
    );

    setReportData((prevData) => {
      const newData = [...prevData];
      const detail = newData[resultatIndex].resultat_details[detailIndex];

      if (scoreRulePoint) {
        detail.scorelabel = selectedLabel;
        detail.score = scoreRulePoint.score;
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const reportUpdateResponse = await axios.patch<Report>(`${apiUrl}/fullreports/${activeReport?.id}/`, {
        eleve: activeEleve?.id,
        professeur: user?.id,
        pdflayout: 1,
        catalogue_ids: activeCatalogues.map(catalogue => catalogue.id), 
        report_data: reportData, // Assuming you are updating with report data
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedReport = reportUpdateResponse.data;
      setReportData(updatedReport.report_catalogues);
      setActiveReport(updatedReport);
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Loading data...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching data. Please try again.</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Test Page</h1>

      {activeEleve ? (
        <div>
          <h2>Active Eleve: {activeEleve.nom} {activeEleve.prenom}</h2>
          <h2>Group Data:</h2>

          {reportData.length === 0 ? (
            <p>No group data found for this catalogue.</p>
          ) : (
            reportData.map((catalogue: ReportCatalogue, catalogueIndex: number) => (
              <div key={catalogueIndex}>
                <h3>Catalogue: {catalogue.description}</h3>

                {catalogue.resultats.map((resultat: Resultat, resultatIndex: number) => (
                  <div key={resultatIndex}>
                    <h4>Resultat for Groupage: {resultat.groupage.desc_groupage}</h4>
                    <p>Total Score: {resultat.score}</p>

                    {resultat.resultat_details.map((detail: ResultatDetail, detailIndex: number) => (
                      <div key={detailIndex}>
                        <p>Item: {detail.item.description}</p>
                        <p>Max Score: {detail.item.max_score}</p>

                        <input
                          type="number"
                          value={detail.score}
                          onChange={(e) => handleScoreLabelChange(resultatIndex, detailIndex, e.target.value, detail.item.scorerule)}
                        />

                        <select
                          value={detail.scorelabel}
                          onChange={(e) => handleScoreLabelChange(resultatIndex, detailIndex, e.target.value, detail.item.scorerule)}
                        >
                          {scoreRulePoints?.filter((srp) => srp.scorerule === detail.item.scorerule)
                            .map((srp: ScoreRulePoint) => (
                              <option key={srp.id} value={srp.scorelabel}>
                                {srp.scorelabel}
                              </option>
                            ))}
                        </select>

                        <input
                          type="text"
                          value={detail.observation}
                          onChange={(e) => handleObservationChange(resultatIndex, detailIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}

          <button onClick={handleSubmit}>Save Report</button>
        </div>
      ) : (
        <p>No active eleve selected.</p>
      )}
    </div>
  );
};

export default Test;
