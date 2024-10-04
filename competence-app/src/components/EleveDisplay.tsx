'use client';

import React, { useState } from 'react';
import { Eleve } from '@/types/eleve'; // Assuming Eleve is correctly defined
import '@/app/globals.css'; // Import global styles
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to manage state

interface EleveDisplayProps {
    eleves: Eleve[];
    onEleveSelect: (id: number) => void; // Function to handle selection
}

const EleveDisplay: React.FC<EleveDisplayProps> = ({ eleves, onEleveSelect }) => {
    const [selectedNiveau, setSelectedNiveau] = useState<string | null>(null);
    const { activeEleve } = useAuth(); // Import activeEleve from AuthContext

    if (!eleves.length) return <p>Loading Eleves...</p>;

    // Extract unique filter values
    const uniqueNiveaux = Array.from(new Set(eleves.map(eleve => eleve.niveau)));

    // Filter eleves based on selected filters
    const filteredEleves = eleves.filter(eleve => {
        return !selectedNiveau || eleve.niveau === selectedNiveau;
    });

    return (
        <div className="mb-4">
            <h2>Eleve Display</h2>

            {/* Filters */}
            <div className="filters">
                <label>
                    Niveau:
                    <select value={selectedNiveau || ''} onChange={e => setSelectedNiveau(e.target.value || null)}>
                        <option value="">All</option>
                        {uniqueNiveaux.map(niveau => (
                            <option key={niveau} value={niveau}>{niveau}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Eleve Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Niveau</th>
                        <th>Date de Naissance</th>
                        <th>Professeurs</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEleves.map(eleve => (
                        <tr
                            key={eleve.id} // Ensure your Eleve has an id property
                            className={activeEleve?.id === eleve.id ? 'selected-row' : ''} // Apply class if it's active
                            onClick={() => onEleveSelect(eleve.id)} // Call the selection function on click
                            style={{ cursor: 'pointer' }} // Optional: Add cursor style for better UX 
                        >
                            <td>{eleve.nom}</td>
                            <td>{eleve.prenom}</td>
                            <td>{eleve.niveau}</td>
                            <td>
                                {eleve.datenaissance instanceof Date && !isNaN(eleve.datenaissance.getTime())
                                    ? eleve.datenaissance.toISOString().substring(0, 10)
                                    : 'N/A'}
                            </td>

                            <td>{eleve.professeurs_details.map(prof => prof.username).join(', ')}</td> {/* Join usernames of professors */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EleveDisplay;
