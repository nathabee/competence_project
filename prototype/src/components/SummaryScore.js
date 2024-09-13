// src/components/SummaryData.js
import React from 'react';

const SummaryScore = ({ aggregatedDataByMatiere }) => {
  return (
    <div  >
        <h2 className="section-title">Résumé par Matière</h2>  
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Matiere</th>
              <th>Groupage</th>
              <th>Total score</th>
              <th>Max score</th>
              <th>Competence acquise</th>
              <th>Avancement</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedDataByMatiere && Object.keys(aggregatedDataByMatiere).length > 0 ? (
              Object.keys(aggregatedDataByMatiere).map(matiere => (
                aggregatedDataByMatiere[matiere].map((row, index) => (
                  <tr key={matiere + index}>
                    <td>{matiere}</td>
                    <td>{row.groupage}</td>
                    <td>{row.score.toFixed(2)}</td>
                    <td>{row.max_score.toFixed(2)}</td>
                    <td>{Math.round((row.score / row.max_score) * 100) + '%'}</td>
                    <td>{row.avancement.toFixed(2)}</td>
                  </tr>
                ))
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table> 
    </div>
  );
};

export default SummaryScore;
