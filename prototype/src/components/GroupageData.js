// src/components/GroupageData.js
import React from 'react';

const GroupageData = ({ groupage_gs }) => {
  return (
    <div  >
                <h2 className="section-title">Seuil des types de test (1 valeur par graphe et par branche araignee) </h2>
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
                        <th>Actions</th>
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
                              onChange={(e) => this.handleGroupageChange(index, 'max_point', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.seuil1}
                              onChange={(e) => this.handleGroupageChange(index, 'seuil1', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.seuil2}
                              onChange={(e) => this.handleGroupageChange(index, 'seuil2', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.max_item}
                              onChange={(e) => this.handleGroupageChange(index, 'max_item', parseFloat(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.matiere}
                              onChange={(e) => this.handleGroupageChange(index, 'matiere', e.target.value)}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => alert(`Update for ${item.groupage}`)}
                            >
                              Update
                            </button>
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
