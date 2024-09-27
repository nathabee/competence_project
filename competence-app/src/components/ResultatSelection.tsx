import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to get active eleve
import axios from 'axios'; // Use axios for making API requests
import { Resultat } from '@/types/resultat'; // Import Resultat interface

const ResultatSelection: React.FC = () => {
  const { activeEleve } = useAuth(); // Get active eleve from AuthContext
  const [resultats, setResultats] = useState<Resultat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedResultatId, setExpandedResultatId] = useState<number | null>(null); // Track expanded Resultat

  useEffect(() => {
    const fetchResultats = async () => {
      if (!activeEleve) return; // No active eleve, no need to fetch resultats

      const token = document.cookie.split('authToken=')[1]; // Fetch token from cookies
      if (!token) {
        console.error('Token not found');
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Get API URL from environment

        const response = await axios.get(`${apiUrl}/resultats/?eleve_id=${activeEleve.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("get /api/resultats/?eleve_id=", activeEleve.id);
        console.log("response", response);

        setResultats(response.data); // Set fetched resultats
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false); // Stop loading once the fetch is done
      }
    };

    fetchResultats();
  }, [activeEleve]);

  if (loading) {
    return <p>Loading results...</p>;
  }

  if (!resultats.length) {
    return <p>No results found for this eleve.</p>;
  }

  const toggleExpand = (resultatId: number) => {
    setExpandedResultatId(expandedResultatId === resultatId ? null : resultatId); // Toggle expanded state
  };

  return (
    <div className="mb-4">
      <h2>Results for {activeEleve?.nom}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Catalogue</th>
            <th>Groupage</th>
            <th>Position</th>
            <th>Score</th>
            <th>Seuil 1 (%)</th>
            <th>Seuil 2 (%)</th>
            <th>Seuil 3 (%)</th>
            <th>Details</th>
            <th>Professeur</th>
          </tr>
        </thead>
        <tbody>
          {resultats.map((resultat) => (
            <React.Fragment key={resultat.id}>
              <tr onClick={() => toggleExpand(resultat.id)} style={{ cursor: 'pointer' }}>
                <td>{resultat.groupage.catalogue.description}</td>
                <td>{resultat.groupage.label_groupage}</td>
                <td>{resultat.groupage.position}</td>
                <td>{resultat.score}</td>
                <td>{resultat.seuil1_percent}</td>
                <td>{resultat.seuil2_percent}</td>
                <td>{resultat.seuil3_percent}</td>                
                <td>{expandedResultatId === resultat.id ? '-' : '+'}</td>
                <td>{resultat.professeur.last_name} {resultat.professeur.first_name}</td>
              </tr>
              {expandedResultatId === resultat.id && (
                <tr>
                  <td colSpan={7}>
                    <div>
                      <h4>Details</h4>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Item Position</th>
                            <th>Temps</th>
                            <th>Description</th>
                            <th>Result</th>
                            <th>Observation</th>
                            <th>Score</th>
                            <th>Professor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultat.resultat_details && resultat.resultat_details.length > 0 ? (
                            resultat.resultat_details.map((detail) => (
                              <tr key={detail.id}>
                                <td>{detail.testdetail.itempos}</td>
                                <td>{detail.testdetail.temps}</td>
                                <td>{detail.testdetail.description}</td>
                                <td>{detail.scorelabel}</td>
                                <td>{detail.observation}</td>
                                <td>{detail.score}</td>
                                <td>{detail.professeur.first_name} {detail.professeur.last_name}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7}>No details available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultatSelection;
