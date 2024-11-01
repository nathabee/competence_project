'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CatalogueDisplay from '@/components/CatalogueDisplay';
import CatalogueSelection from '@/components/CatalogueSelection';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt';

const Catalogue: React.FC = () => {
    const router = useRouter();
    const { catalogue, activeCatalogues } = useAuth();

    const [token, setToken] = useState<string | null>(null);

    // Use useEffect to set the token client-side only
    useEffect(() => {
        const retrievedToken = getTokenFromCookies();
        if (!retrievedToken || isTokenExpired(retrievedToken)) {
            router.push(`/login`);
        } else {
            setToken(retrievedToken);
        }
    }, [router]);

    if (!token) return null; // Show nothing or a loading indicator until token is verified

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
