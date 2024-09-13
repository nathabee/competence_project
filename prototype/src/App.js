import React from 'react';
import Config from './components/Config';
import './styles/prototype.css';  // Import your CSS file
import './styles/pdf.css'; // CSS for PDF
import PrintHeader from './components/PrintHeader';  // Import   component 
import RadarChart from './components/RadarChart';  // Import RadarChart component 
import inputData from './data/inputData';
import SummaryScore from './components/SummaryScore';
import ScoreEleve from './components/ScoreEleve';
// import logo from './logo.png'; // Import the image
import { calculateAvancement, getMatiereDescription, safeStringify } from './utils/utils';
import defaultConfig from './data/config.json'; // Default configuration

import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Import jsPDF autotable plugin if you are using tables

import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

//import logo from './assets/logo.png';

import html2canvas from 'html2canvas';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      // Initialize professor and student info
      profNom: 'Duboucher',
      profPrenom: 'Armand',
      eleveNom: 'Thimothy',
      elevePrenom: 'Ranner',
      eleveNiveau: 'GS',
      eleveEcole: 'Ecole Maternelle des Ursulines de Lannion',
      aggregatedDataByMatiere: {},  // Stores the data grouped by matiere
      chartRefs: {}, // Dynamic references for multiple charts
      chartInstances: {},  // Store chart instances
      inputData: inputData,
      parsedData: [],
      invalidData: [],
      aggregatedData: [],
      config: defaultConfig, // Load default configuration
      activeTab: 'section0' // Default active tab
    };
  }
  _isMounted = false;

  setConfig = (newConfig) => {
    this.setState({ config: newConfig });
  };



  handleTabClick = (tab) => {
    this.setState({ activeTab: tab });
  };


  handlePrintPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // A4 size
    });

    // Capture the printable section using html2canvas
    const printableSection = document.getElementById('printable-section');

    html2canvas(printableSection, {
      scale: 2, // Increase scale for better resolution
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Add the captured content to the PDF
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297); // Fill A4 page

      // Save the PDF
      doc.save('report.pdf');
    });
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
    const { parsedData, config } = this.state;
    const groupage_gs = config.groupage_gs; // Access groupage_gs from config
    const aggregatedDataByMatiere = {};  // Initialize this variable here
    const groupedData = {};

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


  // Method to handle row updates
  handleRowUpdate = (index, fieldName, value) => {
    const updatedParsedData = [...this.state.parsedData];
    updatedParsedData[index] = {
      ...updatedParsedData[index],
      [fieldName]: value
    };
    this.setState({ parsedData: updatedParsedData });
  };

  

  componentWillUnmount() {
    this._isMounted = false; // Corrected line
    const { chartInstances } = this.state;

    // Destroy all chart instances when the component is unmounted
    Object.keys(chartInstances).forEach(matiere => {
      if (chartInstances[matiere]) {
        chartInstances[matiere].destroy();
      }
    });
  }


  componentDidMount() {
    this.setState({ activeTab: 'section0' });
  }





  render() {
    const { parsedData, invalidData, aggregatedDataByMatiere, inputData, config, activeTab } = this.state;

    return (
      <Router>
        <div className="container mt-3">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section0' ? 'active' : ''}`} to="/" onClick={() => this.setState({ activeTab: 'section0' })}>
                Vue d'ensemble
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section1' ? 'active' : ''}`} to="/config" onClick={() => this.setState({ activeTab: 'section1' })}>
                Configuration
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section2' ? 'active' : ''}`} to="/initscore" onClick={() => this.setState({ activeTab: 'section2' })}>
                Import scores
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section3' ? 'active' : ''}`} to="/score" onClick={() => this.setState({ activeTab: 'section3' })}>
                Données de l'eleve
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section4' ? 'active' : ''}`} to="/rejected" onClick={() => this.setState({ activeTab: 'section4' })}>
                Données rejetees
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section5' ? 'active' : ''}`} to="/sumup" onClick={() => this.setState({ activeTab: 'section5' })}>
                Base du graphe
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${activeTab === 'section6' ? 'active' : ''}`} to="/pdf" onClick={() => this.setState({ activeTab: 'section6' })}>
                PDF
              </Link>
            </li>
            {/* Add more navigation links if needed */}
          </ul>

          {/* Route Content */}
          <Routes>
            <Route path="/" element={
              <div className="tab-content mt-3">
                <div className="banner-section">
                  <div className="d-flex">
                    <img src={config.logoURL} alt="Logo" className="logo" />
                    <h1 className="title">Analyse des Données</h1>
                  </div>
                  <p className="mb-2">
                    Objectif de cet outil : Il est fourni pour simuler différents graphiques en toile d'araignée en fonction de la configuration.
                    Cela permet de voir le rendu des données en phase de spécification.
                  </p>
                </div>


                <div className="form-group shadow-section">
                  <p className="mb-2">
                    Pour les tests, des données existantes sont initialisées. Il est possible de modifier cette initialisation dans l'onglet -Donnees export CSV eleve-.
                  </p>

                  <div className="container-2">
                    <div className="F80">
                      <div className="container-2">
                        <div className="left">
                          <h2>Informations du Professeur</h2>
                          <div className="mb-1">
                            <label>Nom du professeur :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.profNom}
                              onChange={e => this.setState({ profNom: e.target.value })}
                            />
                          </div>
                          <div className="mb-1">
                            <label>Prénom du professeur :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.profPrenom}
                              onChange={e => this.setState({ profPrenom: e.target.value })}
                            />
                          </div>
                          <h2>Informations test</h2>
                          <div className="mb-1">
                            <label>Date du test :</label>
                            <input
                              type="text"
                              className="form-control"
                              value="not implemented"
                              readOnly
                            />
                          </div>
                          <div className="mb-1">
                            <label>Catalogue :</label>
                            <input
                              type="text"
                              className="form-control"
                              value="not implemented"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="right">
                          <h2>Informations de l'élève</h2>
                          <div className="mb-1">
                            <label>Nom de l'élève :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.eleveNom}
                              onChange={e => this.setState({ eleveNom: e.target.value })}
                            />
                          </div>
                          <div className="mb-1">
                            <label>Prénom de l'élève :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.elevePrenom}
                              onChange={e => this.setState({ elevePrenom: e.target.value })}
                            />
                          </div>
                          <div className="mb-1">
                            <label>Niveau de l'élève :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.eleveNiveau}
                              onChange={e => this.setState({ eleveNiveau: e.target.value })}
                            />
                          </div>
                          <div className="mb-1">
                            <label>Ecole :</label>
                            <input
                              type="text"
                              className="form-control"
                              value={this.state.eleveEcole}
                              onChange={e => this.setState({ eleveEcole: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="F20">
                      <div className="form-group shadow-section">
                        <button className="btn btn-primary" onClick={this.handleAnalyse}>Analyse</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group shadow-section">
                  <SummaryScore aggregatedDataByMatiere={this.state.aggregatedDataByMatiere} />
                </div>


                <div className="form-group shadow-section">
                  <p>Informations des tests de l'élève </p>
                  <div className="form-group  scrolling-section">
                    <ScoreEleve parsedData={parsedData} editMode={false} />
                  </div>

                </div>
              </div>
            } />

                < Route path="/config" element={
                  < div className="tab-content mt-3" >
                    <Config config={config} setConfig={this.setConfig} defaultConfig={defaultConfig} />
                  </div >
                } />
                < Route path="/initscore" element={
                  < div className="tab-content mt-3" >
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
                  </div >
                } />
                < Route path="/score" element={ 
                  < div className="tab-content mt-3" > 
                      <ScoreEleve parsedData={parsedData} editMode={true} handleUpdate={this.handleRowUpdate} />
                    </div> 
                } />
                < Route path="/rejected" element={
                  < div className="tab-content mt-3" >
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
                  </div >
                } />
                < Route path="/sumup" element={
                  < div className="tab-content mt-3" >
                    <div className="tab-pane fade show active">
                      <SummaryScore aggregatedDataByMatiere={aggregatedDataByMatiere} />
                    </div>
                  </div >
                } />
                < Route path="/pdf" element={
                  < div className="tab-content mt-3" >
                    <div className="form-group shadow-section">
                      <button id="print-button" onClick={this.handlePrintPDF}>Impression PDF</button>
                      <div id="printable-section">
                        <PrintHeader key={config.timestamp} config={config} />
                        <div id="info-header-container">
                          <div id="professor-header">
                            <h2 className="print-info">Informations Professeur</h2>
                          </div>
                          <div id="empty-column-1"></div>
                          <div id="student-header">
                            <h2 className="print-info">Informations Élève</h2>
                          </div>
                          <div id="empty-column-2"></div>
                        </div>
                        <div id="info-container">
                          <div id="professor-info" className="print-info">
                            <p>Nom: {this.state.profNom}</p>
                            <p>Prénom: {this.state.profPrenom}</p>
                          </div>
                          <div id="empty-column-3"></div>
                          <div id="student-info" className="print-info">
                            <p>Nom: {this.state.eleveNom}</p>
                            <p>Prénom: {this.state.elevePrenom}</p>
                            <p>Niveau: {this.state.eleveNiveau}</p>
                          </div>
                          <div id="empty-column-4"></div>
                        </div>
                        <div id="chart-container">
                          <h2 className="section-title">Radar Charts by Matiere</h2>
                          {Object.keys(this.state.aggregatedDataByMatiere).map((matiere, index) => {
                            const data = this.state.aggregatedDataByMatiere[matiere].map(item => item.avancement);
                            const labels = this.state.aggregatedDataByMatiere[matiere].map(item => item.groupage);

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
                  </div >
                } />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes >
        </div >
      </Router >
    );
  }
}

export default App;
