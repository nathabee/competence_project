import React from 'react';
import '../styles/ScoreEleve.css'; // Import CSS file for custom styles

const ScoreEleve = ({ parsedData, nbrows, editMode, handleUpdate }) => {

  const rowsToDisplay = nbrows ? parsedData.slice(0, nbrows) : parsedData;

  const handleInputChange = (index, fieldName, event) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    if (handleUpdate) {
      handleUpdate(index, fieldName, value);
    }
  };


  return (
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
            <td ><div className="description-cell">{row.description}</div></td>   
            <td>
              {editMode ? (
                <textarea
                  className="editable-cell observation-cell"
                  value={row.resultat || ''}
                  onChange={(e) => handleInputChange(index, 'resultat', e)}
                />
              ) : (
                row.resultat
              )}
            </td>
            <td>
              {editMode ? (
                <textarea
                  className="editable-cell observation-cell"
                  value={row.observation || ''}
                  onChange={(e) => handleInputChange(index, 'observation', e)}
                />
              ) : (
                row.observation
              )}
            </td>
            <td>
              <input
                type="number"
                  className="editable-cell"
                value={row.score || 0}
                onChange={(e) => handleInputChange(index, 'score', parseFloat(e.target.value))}
              />
            </td>
            <td>{row.max_score}</td>
            <td>{row.groupage}</td>
            <td>{row.matiere}</td>
            <td>{row.itemid}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
};



export default ScoreEleve;
