'use client';

import React, { useState } from 'react';
import { CatalogueSelectionProps, Catalogue } from '@/types/report'; // Ensure proper import of interfaces
import { useAuth } from '@/context/AuthContext'; // Use AuthContext instead of TestContext
import '@/app/globals.css';

const CatalogueSelection: React.FC<CatalogueSelectionProps> = ({ catalogue }) => {
  const { activeCatalogues, setActiveCatalogues } = useAuth(); // Use activeCatalogues for multi-selection
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Check if there are any catalogues available
  if (!catalogue.length) return <p>No Catalogue found...</p>;

  // Create arrays of unique years, levels, stages, and subjects for filtering
  const uniqueYears = Array.from(new Set(catalogue.map(cat => cat.annee.annee)));
  const uniqueLevels = Array.from(new Set(catalogue.map(cat => cat.niveau.niveau)));
  const uniqueStages = Array.from(new Set(catalogue.map(cat => cat.etape.etape)));
  const uniqueSubjects = Array.from(new Set(catalogue.map(cat => cat.matiere.matiere)));

  // Filter catalogues based on selected criteria
  const filteredCatalogue = catalogue.filter(cat => {
    return (
      (!selectedYear || cat.annee.annee === selectedYear) &&
      (!selectedLevel || cat.niveau.niveau === selectedLevel) &&
      (!selectedStage || cat.etape.etape === selectedStage) &&
      (!selectedSubject || cat.matiere.matiere === selectedSubject)
    );
  });

  // Toggle catalogue selection for multi-selection
  const handleRowClick = (selectedCat: Catalogue) => {
    const isSelected = activeCatalogues.some(cat => cat.id === selectedCat.id);

    // Add or remove the catalogue based on its selection state
    const updatedCatalogues = isSelected
      ? activeCatalogues.filter(cat => cat.id !== selectedCat.id) // Remove if already selected
      : [...activeCatalogues, selectedCat]; // Add if not selected

    setActiveCatalogues(updatedCatalogues); // Update the context
  };

  return (
    <div className="mb-4">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Sélection des types de test:</h2>
        
        {/* Conditional rendering of the warning message */}
        {activeCatalogues.length > 1 && (
          <span className="warning-message">
            Attention, vous avez sélectionné plus d&apos;un catalogue
          </span>
        )}
      </div>

      <div className="filters">
        <label>
          Year:
          <select value={selectedYear || ''} onChange={e => setSelectedYear(e.target.value || null)}>
            <option value="">All</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>

        <label>
          Level:
          <select value={selectedLevel || ''} onChange={e => setSelectedLevel(e.target.value || null)}>
            <option value="">All</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </label>

        <label>
          Stage:
          <select value={selectedStage || ''} onChange={e => setSelectedStage(e.target.value || null)}>
            <option value="">All</option>
            {uniqueStages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </label>

        <label>
          Subject:
          <select value={selectedSubject || ''} onChange={e => setSelectedSubject(e.target.value || null)}>
            <option value="">All</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </label>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Année</th>
            <th>Classe</th>
            <th>Etape</th>
            <th>Matière</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredCatalogue.map(cat => (
            <tr
              key={cat.id}
              onClick={() => handleRowClick(cat)}
              className={activeCatalogues.some(activeCat => activeCat.id === cat.id) ? 'selected-row' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>{cat.annee.annee}</td>
              <td>{cat.niveau.niveau}</td>
              <td>{cat.etape.etape}</td>
              <td>{cat.matiere.matiere}</td>
              <td>{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogueSelection;
