'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import CatalogueSelection from '@/components/CatalogueSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import {  getTokenFromCookies } from '@/utils/jwt'; 
//import { useTranslation } from 'react-i18next';

const Catalogue: React.FC = () => {
    const router = useRouter();
    const { catalogue, activeCatalogues } = useAuth();
    //const { t } = useTranslation(); // Hook to use translations
 

    // Use useEffect to set the token client-side only
    useEffect(() => {
        const retrievedToken = getTokenFromCookies();
        if (!retrievedToken  ) {
            router.push(`/login`);
        }  
    }, [router]);
 

    return (
        <div className="container mt-3 ml-2">
            <h1>Catalogue</h1> 
            <div className="tab-content mt-3">
                <h2>Active Catalogues:</h2>
                {activeCatalogues.length > 0 ? (
                    <CatalogueDisplay selectedCatalogue={activeCatalogues} />
                ) : (
                    <p>No active catalogues selected.</p>
                )}

                <h2>Choisir la liste des tests à faire:</h2>
                {catalogue.length === 0 ? (
                    <p>Pas de catalogue trouvé.</p>
                ) : (
                    <CatalogueSelection catalogue={catalogue} />
                )}
            </div>
        </div>
    );
};

export default Catalogue;
