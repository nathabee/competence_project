import React from 'react';

const ScoreEleve = ({ parsedData, nbrows }) => {
  // Determine the number of rows to display
  const rowsToDisplay = nbrows ? parsedData.slice(0, nbrows) : parsedData;

  return (
    <div>
        <h2 className="section-title">Cahier de l'élève</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Temps</th>
              <th>Description</th>
              <th>Résultat</th>
              <th>Observation</th>
              <th>Score</th>
              <th>Max Score</th>
              <th>Groupage</th>
              <th>Matiere</th>
              <th>ItemId</th>
            </tr>
          </thead>
          <tbody>
            {rowsToDisplay.map((row, index) => (
              <tr key={index}>
                <td>{row.temps}</td>
                <td>{row.description}</td>
                <td>{row.resultat}</td>
                <td>{row.observation}</td>
                <td>{row.score}</td>
                <td>{row.max_score}</td>
                <td>{row.groupage}</td>
                <td>{row.matiere}</td>
                <td>{row.itemid}</td>
              </tr>
            ))}
          </tbody>
        </table> 
    </div>
  );
};

export default ScoreEleve;
