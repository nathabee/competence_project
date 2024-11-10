'use client'; 

import React from 'react';
import { Catalogue } from '@/types/report';
import '@/app/globals.css'; // Import global styles
import useTranslation from '@/utils/translationHelper';

interface CatalogueDisplayProps {
    selectedCatalogue: Catalogue[]; // Catalogues we want to display
}

const CatalogueDisplay: React.FC<CatalogueDisplayProps> = ({ selectedCatalogue }) => {
    const  t  = useTranslation(); // Hook to use translations

    // Check if there are selected catalogues to display
    if (!selectedCatalogue.length) {
        return <p>{t("msg_noCtg")}</p>;
    }

    return (
        <div className="mb-4">

            {/* Catalogue Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>{t("tab_year")}</th>
                        <th>{t("tab_level")}</th>
                        <th>{t("tab_stage")}</th>
                        <th>{t("tab_subject")}</th>
                        <th>{t("tab_desc")}</th>
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
