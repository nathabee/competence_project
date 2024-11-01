'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eleve  } from '@/types/eleve'; 
import EleveSelection from '@/components/EleveSelection';
import ReportEleveSelection from '@/components/ReportEleveSelection';
import EleveForm from '@/components/EleveForm';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt'; 

const ElevePage: React.FC = () => {
    const router = useRouter();
    const { user, activeEleve} = useAuth();  
    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = getTokenFromCookies();

            if (!token || isTokenExpired(token)) {
                router.push(`/login`);
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            try {
                // Fetch Eleves
                const eleveResponse = await axios.get(`${apiUrl}/eleves/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                //console.log('Fetched eleveResponse:', eleveResponse.data);
                setEleves(eleveResponse.data); 

            } catch (fetchError) { // Renamed the error variable
                console.error('Erreur lors de la récupération des données:', fetchError);
                setError(true); // Set error to true
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);
 

    // Filter élèves based on search term
    const filteredEleves = eleves.filter(eleve =>
        `${eleve.nom} ${eleve.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Map élèves to selectable state
    const elevesWithSelectableState = filteredEleves.map(eleve => ({
        ...eleve,
        selectable: eleve.professeurs_details?.some((prof) => prof.id === user?.id)
    }));

    if (loading) {
        return (
            <div className="loading-indicator">
                <p>Chargement des données élèves...</p>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <p>Erreur chargement des élèves. Recommencez SVP.</p>;
    }

    return (
        <div className="container mt-3 ml-2 eleve-page">
            <h1>Gestion des Élèves</h1> 

            {loading && <Spinner animation="border" />}

            {error && (
                <div className="alert alert-danger" role="alert">
                    Erreur lors du chargement des élèves. Recommencez SVP.
                </div>
            )}

            {/* Rest of your component rendering logic */}
            {!loading && !error && (
                <>
                    <div className="tab-content mt-3">
                        {/* Other rendering logic for eleves data */}
                    </div>
                </>
            )}


            <div className="tab-content mt-3">
                <div className="search-bar mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou prénom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                <EleveSelection eleves={elevesWithSelectableState} />

                <div className="mt-4">
                    <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                        Ajouter un nouvel élève
                    </button>
                </div>

                {isFormOpen && (
                    <div className="eleve-form mt-4">
                        <EleveForm setEleves={setEleves} closeForm={() => setIsFormOpen(false)} />
                    </div>
                )}

                {activeEleve ? (
                    <>
                        <h2>Report obtenus par l&apos;élève sélectionné ({activeEleve.nom} {activeEleve.prenom}) :</h2>
                        <ReportEleveSelection eleve={activeEleve} />
                    </>
                ) : (
                    <p>Selectionner un élève.</p>
                )}
            </div>
        </div>
    );
};

export default ElevePage;
