'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const { scoreRulePoints, activeReport, activeEleve, user, setActiveReport, activeCatalogues, activeLayout } = useAuth();
  const [reportData, setReportData] = useState<ReportCatalogue[]>([]);
  const [isModified, setIsModified] = useState<boolean[]>(new Array(reportData.length).fill(false));
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const defaultScoreRulePoint = useMemo(() => ({
    id: 1,
    scorerule: 1,
    scorelabel: "?",
    score: -1,
    description: "Default score rule"
  }), []);

  // Retrieve the token client-side only
  useEffect(() => {
    const retrievedToken = getTokenFromCookies();
    if (!retrievedToken || isTokenExpired(retrievedToken)) {
      router.push(`/login`);
    } else {
      setToken(retrievedToken);
      setLoading(false); // Set loading to false once token is verified
    }


    if (activeReport) {
      setReportData(activeReport.report_catalogues || []); 
    }

  }, [router, activeReport]);

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Chargement des données...</p>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!token) return null; // Don't render if there's no valid token
  
  const handleObservationChange = (reportcatalogueIndex: number, resultatIndex: number, detailIndex: number, value: string) => {
    setReportData((prevData) => {
      const newData = [...prevData];
      newData[reportcatalogueIndex].resultats[resultatIndex].resultat_details[detailIndex].observation = value;
      setIsModified((prev) => {
        const newModified = [...prev];
        newModified[resultatIndex] = true;
        return newModified;
      });
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
    const scoreRulePoint =
      scoreRulePoints?.find(
        (srp) => srp.scorerule === scorerule && srp.scorelabel === selectedLabel
      ) || defaultScoreRulePoint;

    setReportData((prevData) => {
      const newData = [...prevData];
      const detail = newData[reportcatalogueIndex].resultats[resultatIndex].resultat_details[detailIndex];
      detail.scorelabel = selectedLabel;
      const maxScore = detail.item.max_score;
      setIsModified((prev) => {
        const newModified = [...prev];
        newModified[resultatIndex] = true;
        return newModified;
      });
      detail.score = detail.item.scorerule === 8 ? parseInt(selectedLabel, 10) : scoreRulePoint.score;
      if (detail.score > maxScore) detail.score = Math.min(detail.score, maxScore);
      return newData;
    });
  };

  const handleSaveResultat = async (catalogueIndex: number, resultatIndex: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const patchData: ReportCataloguePatch = { id: reportData[catalogueIndex].id, resultats: [] };
    const resultat = reportData[catalogueIndex].resultats[resultatIndex];
    const resultatPatch: ResultatPatch = { id: resultat.id, resultat_details: [] };

    resultat.resultat_details.forEach((detail: ResultatDetail) => {
      resultatPatch.resultat_details.push({
        id: detail.id,
        item_id: detail.item.id,
        score: detail.score,
        scorelabel: detail.scorelabel,
        observation: detail.observation,
      });
    });
    patchData.resultats.push(resultatPatch);
    setLoading(true);
    setIsError(false);

    try {
      const response = await axios.patch(`${apiUrl}/fullreports/${activeReport?.id}/`, {
        id: activeReport?.id || 0,
        eleve: activeEleve?.id || 0,
        professeur: user?.id || 0,
        pdflayout: 1,
        report_catalogues_data: [patchData],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsModified((prev) => {
        const newModified = [...prev];
        newModified[resultatIndex] = false;
        return newModified;
      });
      setActiveReport(response.data);
    } catch (error) {
      setIsError(true);
      console.error('Error updating report:', error);
    } finally {
      setLoading(false);
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

    //console.log('Submit initiated');
    // Iterate through reportData to build patchData
    reportData.forEach((reportcatalogue) => {
      const cataloguePatch: ReportCataloguePatch = { id: reportcatalogue.id, resultats: [] };

      reportcatalogue.resultats.forEach((resultat) => {
        const resultatPatch: ResultatPatch = { id: resultat.id, resultat_details: [] };

        resultat.resultat_details.forEach((detail) => {
          resultatPatch.resultat_details.push({
            id: detail.id,
            item_id: detail.item.id,
            score: detail.score,
            scorelabel: detail.scorelabel,
            observation: detail.observation,
          });
        });

        // Add the result patch if it has any details
        if (resultatPatch.resultat_details.length > 0) {
          cataloguePatch.resultats.push(resultatPatch);
        }
      });

      // Add the catalogue patch if it has any results
      if (cataloguePatch.resultats.length > 0) {
        patchData.push(cataloguePatch);
      }
    });

    //console.log('Final patch data to be sent:', patchData); 

    setLoading(true); 
    setIsError(false);

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

        console.log('Patch request successful fullreports id', response.data);

        // Optionally update state with the new report data
        setActiveReport(response.data); // Update the active report with the response


        // Reset the isModified state to false for all results
        setIsModified(new Array(reportData.length).fill(false));
        // setReportData(response.data.report_catalogues || []); // Uncomment to update local reportData
      } else {
        console.log('No actual changes detected'); // This might not occur anymore since we're sending all data
      }
    } catch (error) {
      setIsError(true);
      console.error('Error updating report:', error);
      return('Erreur mise à jour du rapport. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };


  const createReport = async () => {
    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    //setActiveEleve(eleve);

    //if (typeof window !== 'undefined') {
    //localStorage.setItem('activeEleve', JSON.stringify(eleve));
    //}

    if (!activeCatalogues || activeCatalogues.length === 0) {
      console.error('Catalogue de test vide ou non sélectionné.');
      return; // Prevent API call if activeCatalogues is not valid
    }



    setLoading(true); 
    setIsError(false);
    try {
      const catalogueIds = activeCatalogues.map(cat => cat.id);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const reportCreationResponse = await axios.post(`${apiUrl}/fullreports/`, {
        eleve: activeEleve?.id,
        professeur: user?.id,
        pdflayout: 1,
        catalogue_ids: catalogueIds,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdReport = reportCreationResponse.data;
      //console.log("post fullreports for creation", createdReport);
      setActiveReport(createdReport);

      router.push(`/test/`);
    } catch (error) {
      setIsError(true);
      console.error('Error creating report:', error);
      return('Erreur creation du rapport. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator">
        <p>Chargement des données...</p>
        <Spinner animation="border" />
      </div>
    );
  }


  if (isError) {
    return <p>Erreur récupération des données. Recommencez plus tard SVP.</p>;
  }

  
  return (
    <div className="container mt-3 ml-2">
    {activeEleve && activeLayout && activeCatalogues ? (
      <>
        <button onClick={createReport} className="button-warning">Création nouveau Report</button>
      </>
    ) : (
      <p>Commencez par sélectionner un élève.</p>
    )}

    {activeReport && (
      <>
        <button onClick={handleSubmit} className="button-warning">Sauvegarde du rapport</button>
      </>
    )}

    <h1>History report élève :</h1>
      {activeEleve ? (
        <>
          <h2>Report obtenus par l&apos;élève sélectionné :</h2>
          <ReportEleveSelection eleve={activeEleve} />
        </>
      ) : (
        <p>Commencez par sélectionner un élève pour voir le resultat</p>
      )}


      {activeEleve ? (
        <div>

          {activeReport && (
            <div>
              <h4>Report ID: {activeReport.id}</h4>
              <p>Professeur ID: {activeReport.professeur}</p>
              <p>Créé le: {new Date(activeReport.created_at).toLocaleDateString('fr-FR')}</p>
              <p>Mise en page du PDF: {activeReport.pdflayout}</p>
            </div>
          )}

          <h2>Catégorie de tests:</h2>

          {reportData.length === 0 ? (
            <p>Pas de catégories de tests trouvée pour ce type de test.</p>
          ) : (

            reportData.map((reportcatalogue: ReportCatalogue, reportcatalogueIndex: number) => (
              <div key={reportcatalogueIndex}>
                <h3>Type de tests: {reportcatalogue.catalogue.description}</h3>

                {reportcatalogue.resultats.map((resultat: Resultat, resultatIndex: number) => (
                  <div key={resultatIndex} style={{ backgroundColor: resultat.score < 0 ? 'var(--custom-warning)' : 'transparent' }}>
                    <h4>Résultat par catégorie: {resultat.groupage.desc_groupage}</h4>
                    <p>Score total: {resultat.score}</p>

                    {resultat.resultat_details.map((detail: ResultatDetail, detailIndex: number) => (
                      <div key={detailIndex}>
                        <p>Test: {detail.item.description}</p>
                        <p>Score maximal: {detail.item.max_score}</p>

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

                    {/* Conditionally apply the warning style based on the isModified state for this specific resultat */}
                    <button
                      onClick={() => handleSaveResultat(reportcatalogueIndex, resultatIndex)}
                      className={isModified[resultatIndex] ? "button-warning" : "button-transparent"}
                    >
                      Sauvegarde des résultats
                    </button>

                  </div>
                ))}
              </div>


            ))
          )}
        </div>
      ) : (
        <p>Selectionner un élève SVP</p>
      )}
    </div>
  );
};




export default Test;
