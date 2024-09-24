'use client';

// src/components/CatalogueSelection.tsx
import React, { useState } from 'react';
import { CatalogueSelectionProps, Catalogue } from '@/types/catalogue';
import { useTestContext } from '@/context/TestContext';
import '@/app/globals.css'; // Import global styles


const CatalogueSelection: React.FC<CatalogueSelectionProps> = ({ catalogue }) => {
    const { setActiveCatalogue } = useTestContext();
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [activeCatalogueId, setActiveCatalogueId] = useState<number | null>(null);

    if (!catalogue.length) return <p>Loading Catalogue...</p>;

    const uniqueYears = Array.from(new Set(catalogue.map(cat => cat.annee.annee)));
    const uniqueLevels = Array.from(new Set(catalogue.map(cat => cat.niveau.niveau)));
    const uniqueStages = Array.from(new Set(catalogue.map(cat => cat.etape.etape)));
    const uniqueSubjects = Array.from(new Set(catalogue.map(cat => cat.matiere.matiere)));

    const filteredCatalogue = catalogue.filter(cat => {
        return (
            (!selectedYear || cat.annee.annee === selectedYear) &&
            (!selectedLevel || cat.niveau.niveau === selectedLevel) &&
            (!selectedStage || cat.etape.etape === selectedStage) &&
            (!selectedSubject || cat.matiere.matiere === selectedSubject)
        );
    });

    const handleRowClick = (selectedCat: Catalogue) => {
        setActiveCatalogueId(selectedCat.id); // Mark the active row
        setActiveCatalogue(selectedCat); // Set the active catalogue in context
    };

    return (
        <div className="mb-4">
            <h2>Catalogue Selection</h2>

            {/* Filters */}
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

            {/* Catalogue Table   'var(--custom-blue)'  */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Level</th>
                        <th>Stage</th>
                        <th>Subject</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCatalogue.map(cat => (
                        <tr
                            key={cat.id}
                            onClick={() => handleRowClick(cat)}
                            className={activeCatalogueId === cat.id ? 'selected-row' : ''}
                            style={{
                                cursor: 'pointer',
                            }}
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
