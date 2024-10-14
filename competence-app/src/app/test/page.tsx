'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReportEleveSelection from '@/components/ReportEleveSelection';

import { ReportCatalogue, ResultatDetail, ScoreRulePoint, Resultat } from '@/types/report';
import { ReportCataloguePatch, ResultatPatch } from '@/types/reportpatch';

const Test: React.FC = () => {
  const router = useRouter();
  const { scoreRulePoints,
    setScoreRulePoints,
    activeReport,
    setActiveReport,
    activeCatalogues,
    activeEleve,
    user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportCatalogue[]>([]);
  //const [originalData, setOriginalData] = useState<ReportCatalogue[]>([]);


  const defaultScoreRulePoint = useMemo(() => ({
    id: 1,
    scorerule: 1,
    scorelabel: "?",
    score: -1,
    description: "Default score rule"
  }), []); // Memoize this object

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromCookies(); // Automatically gets the token from cookies

      if (!token || isTokenExpired(token)) {
        router.push(`/login`);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        if (!scoreRulePoints || scoreRulePoints.length === 0) {
          const scoreRuleResponse = await axios.get<ScoreRulePoint[]>(`${apiUrl}/scorerulepoints/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setScoreRulePoints(scoreRuleResponse.data);
        }

        if (activeReport) {
          setReportData(activeReport.report_catalogues || []);
          //setOriginalData(activeReport.report_catalogues || []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, activeCatalogues, activeReport]);

  const handleObservationChange = (reportcatalogueIndex: number, resultatIndex: number, detailIndex: number, value: string) => {
    setReportData((prevData) => {
      const newData = [...prevData];
      newData[reportcatalogueIndex].resultats[resultatIndex].resultat_details[detailIndex].observation = value;
      return newData;
    });
  };


  const handleScoreLabelChange = (
    reportcatalogueIndex: number,
    resultatIndex: number,
    detailIndex: number,
    selectedLabel: string,
    scorerule: number
  ) => {
    // Find the score rule point based on the selected label
    const scoreRulePoint =
      scoreRulePoints?.find(
        (srp) => srp.scorerule === scorerule && srp.scorelabel === selectedLabel
      ) || defaultScoreRulePoint; // Fallback to default if not found

    setReportData((prevData) => {
      const newData = [...prevData];
      const detail = newData[reportcatalogueIndex].resultats[resultatIndex].resultat_details[detailIndex];

      // Update the scorelabel
      detail.scorelabel = selectedLabel;

      // Extract the max score for the current detail
      const maxScore = detail.item.max_score;

      // Determine the score based on the scorerule
      if (detail.item.scorerule === 8) {
        // Set score to the integer value of selectedLabel
        detail.score = parseInt(selectedLabel, 10); // Convert selectedLabel to an integer
      } else {
        // Use the score from found scoreRulePoint or the default
        detail.score = scoreRulePoint.score;
      }

      // Log an error if the score exceeds the maximum allowed score
      if (detail.score > maxScore) {
        console.error(`Score (${detail.score}) exceeds max score (${maxScore}) for item: ${detail.item.description}`);
        // Optionally reset score to maxScore or keep the previous score
        detail.score = Math.min(detail.score, maxScore); // Ensures score doesn't exceed maxScore
      }

      return newData; // Return the updated data
    });
  };


  const handleSaveResultat = async (catalogueIndex: number, resultatIndex: number) => {
    console.log(`Starting save for catalogueIndex: ${catalogueIndex}, resultatIndex: ${resultatIndex}`);

    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    console.log('Token:', token);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('API URL:', apiUrl);

    const patchData: ReportCataloguePatch = { id: reportData[catalogueIndex].id, resultats: [] };
    console.log('Initial patchData:', JSON.stringify(patchData));

    const resultat = reportData[catalogueIndex].resultats[resultatIndex];
    console.log('Resultat to save:', JSON.stringify(resultat));

    const resultatPatch: ResultatPatch = { id: resultat.id, resultat_details: [] };

    resultat.resultat_details.forEach((detail: ResultatDetail) => {
      console.log(`Processing detail with ID: ${detail.id}`);
      resultatPatch.resultat_details.push({
        id: detail.id,
        item_id: detail.item.id,
        score: detail.score,
        scorelabel: detail.scorelabel,
        observation: detail.observation,
      });
    });

    patchData.resultats.push(resultatPatch);
    console.log('Final patchData:', JSON.stringify(patchData));

    try {
      console.log('Sending PATCH request...');
      const response = await axios.patch(`${apiUrl}/fullreports/${activeReport?.id}/`, {
        id: activeReport?.id || 0,
        eleve: activeEleve?.id || 0,
        professeur: user?.id || 0,
        pdflayout: 1,
        report_catalogues_data: [patchData], // wrap in an array
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Patch request successful for resultat', response.data);

      // Optionally update state here based on the response
    } catch (error) {
      console.error('Error updating resultat:', error);
    }
  };

  const handleSubmit = async () => {
    // Ensure activeReport is not null
    if (!activeReport) {
      console.error("activeReport is null. Aborting submission.");
      return; // Early return if activeReport is null
    }

    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const patchData: ReportCataloguePatch[] = [];

    console.log('Submit initiated');

    // Iterate through reportData to build patchData
    reportData.forEach((reportcatalogue, reportcatalogueIndex) => {
      console.log(`Processing catalogue at index ${reportcatalogueIndex}:`, reportcatalogue);
      const cataloguePatch: ReportCataloguePatch = { id: reportcatalogue.id, resultats: [] };

      reportcatalogue.resultats.forEach((resultat, resultatIndex) => {
        console.log(`  Processing resultat at index ${resultatIndex}:`, resultat);
        const resultatPatch: ResultatPatch = { id: resultat.id, resultat_details: [] };

        resultat.resultat_details.forEach((detail, detailIndex) => {
          console.log(`    Processing detail at index ${detailIndex}:`, detail);

          // Always include the details without checking for changes
          resultatPatch.resultat_details.push({
            id: detail.id,
            item_id: detail.item.id,
            score: detail.score,
            scorelabel: detail.scorelabel,
            observation: detail.observation,
          });

          console.log(`    Added detail to patch:`, resultatPatch.resultat_details);
        });

        // Push the resultat patch if it contains details
        if (resultatPatch.resultat_details.length > 0) {
          cataloguePatch.resultats.push(resultatPatch);
          console.log(`  Resultat patch added:`, resultatPatch);
        }
      });

      // Push the catalogue patch if it contains resultats
      if (cataloguePatch.resultats.length > 0) {
        patchData.push(cataloguePatch);
        console.log(`Catalogue patch added:`, cataloguePatch);
      }
    });

    console.log('Final patch data to be sent:', patchData);

    try {
      if (patchData.length > 0) {
        const response = await axios.patch(`${apiUrl}/fullreports/${activeReport?.id}/`, {
          id: activeReport?.id || 0,
          eleve: activeEleve?.id || 0,
          professeur: user?.id || 0,
          pdflayout: 1,
          report_catalogues_data: patchData,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Patch request successful', response.data);

        // Optionally update state with the new report data
        setActiveReport(response.data); // Update the active report with the response
        // setReportData(response.data.report_catalogues || []); // Uncomment to update local reportData
      } else {
        console.log('No actual changes detected'); // This might not occur anymore since we're sending all data
      }
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
    <div className="container mt-3 ml-2">
      <h1>Create or Select a report</h1>
      {activeEleve ? (
        <>
          <h2>Report obtenus par l&apos;eleve selectionne :</h2>
          <ReportEleveSelection eleve={activeEleve} />
        </>
      ) : (
        <p>Please select an eleve to see results.</p>
      )}


      {activeEleve ? (
        <div>

          <button onClick={handleSubmit}>Save Report</button>

          <h2>Group Data:</h2>

          {reportData.length === 0 ? (
            <p>No group data found for this catalogue.</p>
          ) : (
            reportData.map((reportcatalogue: ReportCatalogue, reportcatalogueIndex: number) => (
              <div key={reportcatalogueIndex}>
                <h3>Catalogue: {reportcatalogue.description}</h3>

                {reportcatalogue.resultats.map((resultat: Resultat, resultatIndex: number) => (
                  <div key={resultatIndex} style={{ backgroundColor: resultat.score < 0 ? 'var(--custom-warning)' : 'transparent' }}>
                    <h4>Resultat for Groupage: {resultat.groupage.desc_groupage}</h4>
                    <p>Total Score: {resultat.score}</p>

                    {resultat.resultat_details.map((detail: ResultatDetail, detailIndex: number) => (
                      <div key={detailIndex}>
                        <p>Item: {detail.item.description}</p>
                        <p>Max Score: {detail.item.max_score}</p>

                        <input
                          type="number"
                          value={detail.score}
                          onChange={() => handleScoreLabelChange(reportcatalogueIndex, resultatIndex, detailIndex, detail.scorelabel, detail.item.scorerule)}
                        />

                        <select
                          value={detail.scorelabel || defaultScoreRulePoint.scorelabel} // Default to defaultScoreRulePoint's scorelabel if scorelabel is not set
                          onChange={(e) => handleScoreLabelChange(reportcatalogueIndex, resultatIndex, detailIndex, e.target.value, detail.item.scorerule)}
                        >
                          {detail.item.scorerule === 8 ? (
                            // Generate options from 0 to max_score for scorerule = 8
                            Array.from({ length: detail.item.max_score + 1 }, (_, i) => (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            ))
                          ) : (
                            // Default behavior for other scoring rules
                            scoreRulePoints
                              ?.filter((srp) => srp.scorerule === detail.item.scorerule || srp.scorerule === defaultScoreRulePoint.scorerule) // Include default scorerule
                              .map((srp: ScoreRulePoint) => (
                                <option key={srp.id} value={srp.scorelabel}>
                                  {srp.scorelabel}
                                </option>
                              ))
                          )}
                        </select>


                        <input
                          type="text"
                          value={detail.observation}
                          onChange={(e) => handleObservationChange(reportcatalogueIndex, resultatIndex, detailIndex, e.target.value)}
                        />
                      </div>
                    ))}

                    {/* Add a Save button for each resultat */}
                    <button onClick={() => handleSaveResultat(reportcatalogueIndex, resultatIndex)}>Save Resultat</button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      ) : (
        <p>No active eleve selected.</p>
      )}
    </div>
  );
};




export default Test;
