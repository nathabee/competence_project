import React, { Component } from 'react';
import './styles/prototype.css';  // Import your CSS file
import RadarChart from './components/RadarChart';  // Import RadarChart component 
import inputData from './data/inputData';
// import logo from './logo.png'; // Import the image
import { calculateAvancement, getMatiereDescription, safeStringify } from './utils/utils';







class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aggregatedDataByMatiere: {},  // Stores the data grouped by matiere
      chartRefs: {}, // Dynamic references for multiple charts
      chartInstances: {},  // Store chart instances
      inputData: inputData,
      parsedData: [],
      invalidData: [],
      aggregatedData: [],
      groupage_gs: [
        { groupage: 'CATEGORISATION', label_groupage: 'CATEGORISATION', max_point: 6, seuil1: 2, seuil2: 3, max_item: 6, matiere: 'C' },
        { groupage: 'LA RÉSOLUTION DE PROBLEMES', label_groupage: 'LA RÉSOLUTION DE PROBLEMES', max_point: 6, seuil1: 1, seuil2: 2, max_item: 3, matiere: 'C' },
        { groupage: 'LA SUITE NUMÉRIQUE', label_groupage: 'LA SUITE NUMÉRIQUE', max_point: 15, seuil1: 2, seuil2: 3, max_item: 8, matiere: 'C' },
        { groupage: 'LES COULEURS', label_groupage: 'LES COULEURS', max_point: 22, seuil1: 5, seuil2: 8, max_item: 22, matiere: 'P' },
        { groupage: 'MEMORISATION HISTOIRE', label_groupage: 'MEMORISATION HISTOIRE', max_point: 10, seuil1: 2, seuil2: 3, max_item: 7, matiere: 'C' },
        { groupage: 'PHONOLOGIE', label_groupage: 'PHONOLOGIE COGNITIVE', max_point: 11, seuil1: 2, seuil2: 3, max_item: 6, matiere: 'C' },
        { groupage: 'PHONOLOGIE', label_groupage: 'PHONOLOGIE SENSORIELLE', max_point: 20, seuil1: 2, seuil2: 4, max_item: 10, matiere: 'P' },
        { groupage: 'RECONNAISSANCE PRENOM', label_groupage: 'RECONNAISSANCE PRENOM', max_point: 5, seuil1: 2, seuil2: 3, max_item: 8, matiere: 'C' },
        { groupage: 'REPÉRAGE SPATIAL ET TOPOLOGIE', label_groupage: 'REPÉRAGE SPATIAL ET TOPOLOGIE COGNITIVE', max_point: 16, seuil1: 2, seuil2: 3, max_item: 8, matiere: 'C' },
        { groupage: 'REPÉRAGE SPATIAL ET TOPOLOGIE', label_groupage: 'REPÉRAGE SPATIAL ET TOPOLOGIE PERCEPTIVE', max_point: 16, seuil1: 2, seuil2: 3, max_item: 8, matiere: 'P' }
      ],


      activeTab: 'section0' // Default active tab
    };
  }

  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };





  handleInputChange = (e) => {
    this.setState({ inputData: e.target.value });
  }

  handleAnalyse = () => {
    const { inputData } = this.state;
    const rows = inputData.trim().split('\n');
    const parsedData = [];
    const invalidData = [];

    rows.forEach(row => {
      const cols = row.split(';');
      const itemid = parseInt(cols[8]);

      if (Number.isInteger(itemid)) {
        parsedData.push({
          temps: cols[0],
          description: cols[1],
          resultat: cols[2],
          observation: cols[3],
          score: parseFloat(cols[4]),
          max_score: parseFloat(cols[5]),
          groupage: cols[6],
          matiere: cols[7],
          itemid: itemid
        });
      } else {
        invalidData.push(row);
      }
    });

    this.setState({ parsedData, invalidData }, this.aggregateData);
  }



  aggregateData = () => {
    const { parsedData, groupage_gs } = this.state;
    const groupedData = {};
    const aggregatedDataByMatiere = {};  // Initialize this variable here

    // Create a map for quick lookup of groupage_gs data
    const groupageMap = new Map(groupage_gs.map(item => [item.groupage, item]));
    console.log("groupageMap created:", groupageMap);


    parsedData.forEach(row => {
      const score = parseFloat(row.score);
      const max_score = parseFloat(row.max_score);

      if (!isNaN(score) && !isNaN(max_score)) {
        if (!groupedData[row.groupage]) {
          groupedData[row.groupage] = {
            groupage: row.groupage,
            score: 0,
            max_score: 0,
            avancement: 0,  // Initialize avancement
            matiere: row.matiere,  // id du graphe if we want to display on several graph
          };
        }

        groupedData[row.groupage].score += score;
        groupedData[row.groupage].max_score += max_score;
      }
    });

    // Calculate avancement for each groupage
    Object.keys(groupedData).forEach(groupage => {
      const item = groupageMap.get(groupage);
      const data = groupedData[groupage];
      const result = data.score;

      data.avancement = calculateAvancement(item, result);

      // Group data by "matiere"
      if (!aggregatedDataByMatiere[data.matiere]) {
        aggregatedDataByMatiere[data.matiere] = [];
      }
      aggregatedDataByMatiere[data.matiere].push(data);
      console.log("push data ", data);  // Log the resultat value 
      console.log("for the matiere :", data.matiere);  // Log the resultat value 
      console.log("new value of aggregatedDataByMatiere", aggregatedDataByMatiere);  // Log the resultat value 

    });

    this.setState({ aggregatedDataByMatiere }, this.drawRadarCharts);  // Update state
  };



  drawRadarCharts = (matiere) => {
    const { aggregatedDataByMatiere, chartRefs, chartInstances } = this.state;

    if (matiere) {
      // Draw only for the specific 'matiere'
      const data = aggregatedDataByMatiere[matiere];
      const labels = data.map(item => item.groupage);
      const avancementData = data.map(item => item.avancement);


      console.log("********drawRadarCharts for matiere ******", matiere);  // Log the resultat value  
      console.log("aggregatedDataByMatiere:", safeStringify(aggregatedDataByMatiere));
      console.log("data for matiere ", data);  // Log the resultat value 
      console.log("labels for matiere ", labels);  // Log the resultat value 
      console.log("avancementData for matiere ", avancementData);  // Log the resultat value  

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Avancement',
            data: avancementData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true,
          }
        ]
      };

      const chartRef = chartRefs[matiere];
      if (chartRef) {
        const ctx = chartRef.getContext('2d');

        // Check if a chart instance already exists and destroy it
        if (chartInstances[matiere]) {
          chartInstances[matiere].destroy();
        }

        // Create and store the new chart instance
        const newChart = new Chart(ctx, {
          type: 'radar',
          data: chartData,
          options: {
            scales: {
              r: {
                min: 0,
                max: 3,
                beginAtZero: true,
              }
            }
          }
        });

        // Update the chartInstances in state
        this.setState(prevState => ({
          chartInstances: { ...prevState.chartInstances, [matiere]: newChart }
        }));
      } else {
        console.error(`Canvas reference for ${matiere} is not available.`);
      }
    } else {
      // Draw charts for all matiere if no specific matiere is passed
      Object.keys(aggregatedDataByMatiere).forEach(matiere => {
        this.drawRadarCharts(matiere);
      });
    }
  };

  componentWillUnmount() {
    const { chartInstances } = this.state;

    // Destroy all chart instances when the component is unmounted
    Object.keys(chartInstances).forEach(matiere => {
      if (chartInstances[matiere]) {
        chartInstances[matiere].destroy();
      }
    });
  }



  handleGroupageChange = (index, field, value) => {
    const { groupage_gs } = this.state;
    const updatedGroupageGs = [...groupage_gs];
    updatedGroupageGs[index][field] = value;
    this.setState({ groupage_gs: updatedGroupageGs });
  }


  render() {
    const { parsedData, invalidData, aggregatedDataByMatiere, chartRefs, groupage_gs, inputData, activeTab } = this.state;

    return (
      <div className="container mt-3">
        {/* Navigation Tabs */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section0' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section0' })}
            >
              Vue d'ensemble
            </a>
          </li>
          {< li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section1' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section1' })}
            >
              Configuration
            </a>
          </li >}
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section2' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section2' })}
            >
              Données export CSV Excel
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section3' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section3' })}
            >
              Données de l'eleve
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section4' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section4' })}
            >
              Données rejetees
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section5' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section5' })}
            >
              Base du graphe
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'section6' ? 'active' : ''}`}
              href="#"
              onClick={() => this.setState({ activeTab: 'section6' })}
            >
              Graphes araignee
            </a>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mt-3">
          {/* Section 0: Header */}
          {activeTab === 'section0' && (
            <div className="tab-pane fade show active">
              <div className="banner-section">
                <div className="d-flex">
                  <img src='logo.png' alt='Logo' className='me-3 small-logo' />
                  <h1 className="mb-4 ">Analyse des Données</h1>
                </div>
                <p className="mb-2">Objectif de cet outil : Il est fourni pour simuler comment le graphique en toile d'araignée sera affiché en fonction de la configuration et des données. Cela peut être intéressant lors de la phase de spécification pour voir le rendu des données.</p>
              </div>

              <div className="form-group shadow-section  ">
              <p className="mb-2">Utiliser les donnees existente (voir onglet Donnees export CSV eleve) ou faite un export CSV du fichier excel outil fourni et copier/coller a la place du texte existant</p>

                <button className="btn btn-primary" onClick={this.handleAnalyse}>Analyse</button>
              </div>

              <div className="tab-pane fade show active">
                <div className="form-group shadow-section">
                  <h2 className="section-title">Appercu des score de l'eleve aggrges par Matière</h2>
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
              </div>

            </div>
          )}



          {/* Section 1: Input Data */}
          {activeTab === 'section1' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section scrolling-section">
                <h2 className="section-title">Donnee d'initialisation :</h2>
              </div>
              {/* Section 1: Groupage Data */}

              <div className="form-group shadow-section">
                <h2 className="section-title">Groupage Data</h2>
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



            </div>
          )}


          {/* Section 2: Input Data */}
          {activeTab === 'section2' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section scrolling-section">
                <h2 className="section-title">Enter your data :</h2>
                <label htmlFor="dataInput">
                  Copier les données ici (format: Temps;Description;Resultat;Observation;Points;Max_Point;Categorie;Type;ItemId;Vide;):
                </label>
                <textarea
                  className="form-control"
                  id="dataInput"
                  rows="5"
                  value={inputData}
                  onChange={this.handleInputChange}
                ></textarea>
              </div>
            </div>
          )}

          {/* Section 3: Parsed Data */}
          {activeTab === 'section3' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section scrolling-section">
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
                    {parsedData.map((row, index) => (
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
            </div>
          )}

          {/* Section 4: Invalid Data */}
          {activeTab === 'section4' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section">
                <h2 className="section-title">Invalid Data</h2>
                <div className="invalid-data">
                  {invalidData.length === 0 ? (
                    <p>No invalid data found.</p>
                  ) : (
                    <ul>
                      {invalidData.map((row, index) => (
                        <li key={index}>{row}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Aggregated Data By Matiere */}
          {activeTab === 'section5' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section">
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
            </div>
          )}

          {/* Section 6: Radar Charts */}
          {activeTab === 'section6' && (
            <div className="tab-pane fade show active">
              <div className="form-group shadow-section">
                <h2 className="section-title">Radar Charts by Matiere</h2>
                <div className="row">

                  {/* Utilisation de RadarChart as component... muss also canva handle */}

                  {Object.keys(aggregatedDataByMatiere).map((matiere, index) => {
                    const data = aggregatedDataByMatiere[matiere].map(item => item.avancement);
                    const labels = aggregatedDataByMatiere[matiere].map(item => item.groupage);

                    return (
                      <div className="col-6" key={index}>
                        <h3>{getMatiereDescription(matiere)}</h3>
                        <RadarChart
                          matiere={matiere}
                          chartData={{ labels: labels, data: data }}
                          onChartReady={(matiere, chartInstance) => {
                            console.log(`${matiere} chart is ready`, chartInstance);
                          }}

                        />
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

};

export default App;
