import React from 'react';

const GroupageData = ({ groupage_gs, onGroupageChange }) => {
  return (
    <div>
      <h2 className="section-title">Types de regroupement i.e. Branches du graphe</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Groupage</th>
              <th>Max Point</th>
              <th>Seuil 1</th>
              <th>Seuil 2</th>
              <th>Max Item</th>
              <th>Matiere</th> 
            </tr>
          </thead>
          <tbody>
            {groupage_gs.map((item, index) => (
              <tr key={index}>
                <td>{item.groupage}</td>
                <td>
                  <input
                    type="number"
                    value={item.max_point}
                    onChange={(e) => onGroupageChange(index, 'max_point', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.seuil1}
                    onChange={(e) => onGroupageChange(index, 'seuil1', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.seuil2}
                    onChange={(e) => onGroupageChange(index, 'seuil2', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.max_item}
                    onChange={(e) => onGroupageChange(index, 'max_item', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.matiere}
                    onChange={(e) => onGroupageChange(index, 'matiere', e.target.value)}
                  />
                </td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupageData;
