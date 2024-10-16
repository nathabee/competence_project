'use client'; 

import React from 'react';
import { Catalogue } from '@/types/report';
import '@/app/globals.css'; // Import global styles

interface CatalogueDisplayProps {
    selectedCatalogue: Catalogue[]; // Catalogues we want to display
}

const CatalogueDisplay: React.FC<CatalogueDisplayProps> = ({ selectedCatalogue }) => {
    // Check if there are selected catalogues to display
    if (!selectedCatalogue.length) {
        return <p>Pas d&apos;information sur le catalogue disponible</p>;
    }

    return (
        <div className="mb-4">
            <h2>Affichage des types de test sélectionnés</h2>

            {/* Catalogue Table */}
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
                    {selectedCatalogue.map(cat => (
                        <tr key={cat.id} className="selected-row"> {/* All rows are from selectedCatalogue */}
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

export default CatalogueDisplay;
