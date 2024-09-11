import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [annee, setAnnee] = useState([]);
  const [niveau, setNiveau] = useState([]);
  const [etape, setEtape] = useState([]);
  const [catalogue, setCatalogue] = useState([]);

  // Fetch data from the Django API for combo boxes (annee, niveau, etape)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/annees/`)
      .then(res => res.json())
      .then(data => setAnnee(data));

    fetch(`${apiUrl}/niveaux/`)
      .then(res => res.json())
      .then(data => setNiveau(data));

    fetch(`${apiUrl}/etapes/`)
      .then(res => res.json())
      .then(data => setEtape(data));
  }, []);

  const handleSelect = (event) => {
    const selectedAnnee = event.target.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/catalogue?annee=${selectedAnnee}`)
      .then(res => res.json())
      .then(data => setCatalogue(data));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label htmlFor="annee">Select Annee:</label>
        <select id="annee" onChange={handleSelect}>
          {annee.map(a => (
            <option key={a.id} value={a.id}>{a.annee}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="niveau">Select Niveau:</label>
        <select id="niveau">
          {niveau.map(n => (
            <option key={n.id} value={n.id}>{n.niveau}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="etape">Select Etape:</label>
        <select id="etape">
          {etape.map(c => (
            <option key={c.id} value={c.id}>{c.etape}</option>
          ))}
        </select>
      </div>

      <h2>Catalogue</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {catalogue.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
