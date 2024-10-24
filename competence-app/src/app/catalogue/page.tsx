'use client';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import CatalogueDisplay from '@/components/CatalogueDisplay'; 
import CatalogueSelection from '@/components/CatalogueSelection'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt';
import axios from 'axios';


const Catalogue: React.FC = () => {
    const router = useRouter();
    const {
        activeCatalogues,
        catalogue,
        setCatalogue,
    } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = getTokenFromCookies(); // Automatically gets the token from cookies

            if (!token || isTokenExpired(token)) {
                router.push(`/login`);
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            try {
                // Fetch Catalogues, Eleves, and Layouts if they are not already set
                if (catalogue.length === 0) {
                    const catalogueResponse = await axios.get(`${apiUrl}/catalogues/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("get catalogues ",catalogueResponse.data)
                    setCatalogue(catalogueResponse.data);
                }


            } catch (error) {
                console.error('Error fetching data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);  // Adding dependencies as needed

    if (loading) {
        return (
            <div className="loading-indicator">
                <p>Chargement de données...</p>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <p>Erreur récupération des données. Recommencez SVP.</p>;
    }

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
