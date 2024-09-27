// src/components/EleveSelection.tsx
'use client';

import React, { useState } from 'react';
import { EleveSelectionProps, Eleve } from '@/types/eleve';
import { useAuth } from '@/context/AuthContext'; // Import AuthContext
import '@/app/globals.css'; // Import global styles

const EleveSelection: React.FC<EleveSelectionProps> = ({ eleve }) => {
    const { activeEleve, setActiveEleve } = useAuth(); // Use AuthContext
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
    const [searchNom, setSearchNom] = useState<string>('');
    const [searchPrenom, setSearchPrenom] = useState<string>('');

    if (!eleve.length) return <p>Loading Eleve...</p>;

    // Get unique classes
    const uniqueClasses = Array.from(new Set(eleve.map(cat => cat.niveau)));

    // Filter eleves based on selected class and search criteria
    const filteredEleve = eleve.filter(cat => {
        return (
            (!selectedClasse || cat.niveau === selectedClasse) &&
            (searchNom === '' || cat.nom.toLowerCase().includes(searchNom.toLowerCase())) &&
            (searchPrenom === '' || cat.prenom.toLowerCase().includes(searchPrenom.toLowerCase()))
        );
    });

    const handleRowClick = (selectedEleve: Eleve) => {
        setActiveEleve(selectedEleve); // Set active eleve in context
    };

    return (
        <div className="mb-4">
            <h2>Eleve Selection</h2>

            {/* Filters */}
            <div className="filters">
                <label>
                    Class:
                    <select value={selectedClasse || ''} onChange={e => setSelectedClasse(e.target.value || null)}>
                        <option value="">All</option>
                        {uniqueClasses.map(classe => (
                            <option key={classe} value={classe}>{classe}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Nom:
                    <input
                        type="text"
                        value={searchNom}
                        onChange={e => setSearchNom(e.target.value)}
                        placeholder="Search by Nom"
                    />
                </label>

                <label>
                    Prenom:
                    <input
                        type="text"
                        value={searchPrenom}
                        onChange={e => setSearchPrenom(e.target.value)}
                        placeholder="Search by Prenom"
                    />
                </label>
            </div>

            {/* Eleve Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prenom</th>
                        <th>Classe</th>
                        <th>Note 1</th>
                        <th>Note 2</th>
                        <th>Note 3</th>
                        <th>Professeurs</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEleve.map(cat => (
                        <tr
                            key={cat.id}
                            onClick={() => handleRowClick(cat)}
                            className={activeEleve?.id === cat.id ? 'selected-row' : ''}
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            <td>{cat.nom}</td>
                            <td>{cat.prenom}</td>
                            <td>{cat.niveau}</td>
                            <td>{cat.textnote1}</td>
                            <td>{cat.textnote2}</td>
                            <td>{cat.textnote3}</td>
                            <td>{cat.professeurs.map(prof => prof.username).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EleveSelection;
