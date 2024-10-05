'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
//import { Eleve } from '@/types/eleve'; // Eleve type
//import { Report } from '@/types/report'; // Report type
import { GroupageData , Item} from '@/types/groupage'; // Assuming you have a GroupageData type
import { ScoreRulePoint } from '@/types/score'; // Assuming ScoreRulePoint type exists

const Test: React.FC = () => {
  const router = useRouter();
  const { activeCatalogue, activeEleve, user } = useAuth();  //, isLoggedIn
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [reportData, setReportData] = useState<GroupageData[]>([]); // Typed as GroupageData array
  const [scoreRulePoints, setScoreRulePoints] = useState<ScoreRulePoint[]>([]); // Typed as ScoreRulePoint array
  //const [totalScore, setTotalScore] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split('authToken=')[1]?.split(';')[0];

      if (!token) {
        router.push(`/login`);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        console.log(`TEST Token: Bearer ${token}`);
        
        // Fetch score rule points
        const scoreRuleResponse = await axios.get(`${apiUrl}/scorerulepoints/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScoreRulePoints(scoreRuleResponse.data);
        console.log(scoreRulePoints);

        if (!activeCatalogue) {
          throw new Error('No active catalogue selected');
        }

        // Fetch group data and prepare report
        const groupDataResponse = await axios.get(`${apiUrl}/groupagedata/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { catalogueId: activeCatalogue.id },
        });

        const reportData = groupDataResponse.data.map((groupagedata: GroupageData) => {
          const resultDetails = groupagedata.items.map((item : Item) => {
            const scoreRulePoint = scoreRuleResponse.data.find((srp: ScoreRulePoint) => srp.scorerule === item.scorerule) || { scorelabel: "N/A", score: 0 };
            return {
              item: item.id,
              score: scoreRulePoint.score,
              scorelabel: scoreRulePoint.scorelabel,
              observation: "observation ecrit de la main gauche",
            };
          });

          const totalScore = resultDetails.reduce((acc: number, detail) => acc + detail.score, 0);

          return {
            groupage: groupagedata.id,
            score: totalScore,
            seuil1_percent: 100,
            seuil2_percent: 50,
            seuil3_percent: 0,
            resultat_details: resultDetails,
          };
        });

        setReportData(reportData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, activeCatalogue]);

  const handleObservationChange = (index: number, value: string) => {
    setReportData((prevData) => {
      const newData = [...prevData];
      newData[index].resultat_details.forEach((detail) => {
        detail.observation = value;
      });
      return newData;
    });
  };

  const handleScoreLabelChange = (index: number, value: string) => {
    setReportData((prevData) => {
      const newData = [...prevData];
      newData[index].resultat_details.forEach((detail) => {
        detail.scorelabel = value;
      });
      return newData;
    });
  };

  const handleSubmit = async () => {
    const token = document.cookie.split('authToken=')[1]?.split(';')[0];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const reportCreationResponse = await axios.post(`${apiUrl}/full_report_creation/`, {
        eleve: activeEleve?.id, // Ensure activeEleve exists
        professeur: user?.id, // Ensure user exists
        pdflayout: 1, // Assuming pdflayout ID is 1 for example
        report_catalogues: reportData.map((data) => ({
          catalogue: activeCatalogue?.id, // Ensure activeCatalogue exists
          resultats: [data],
        })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Report created:', reportCreationResponse.data);
      // Redirect or show a success message
    } catch (error) {
      console.error('Error creating report:', error);
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
            reportData.map((data, index) => (
              <div key={index}>
                <h3>Groupage ID: {data.groupage}</h3>
                <p>Total Score: {data.score}</p>
                <div>
                  {data.resultat_details.map((detail, detailIndex) => (
                    <div key={detailIndex}>
                      <p>Item: {detail.item}</p>
                      <p>Score: {detail.score}</p>
                      <input
                        type="text"
                        value={detail.scorelabel}
                        onChange={(e) => handleScoreLabelChange(index, e.target.value)}
                      />
                      <input
                        type="text"
                        value={detail.observation}
                        onChange={(e) => handleObservationChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <button onClick={handleSubmit}>Create Report</button>
        </div>
      ) : (
        <p>No active eleve selected.</p>
      )}
    </div>
  );
};

export default Test;
