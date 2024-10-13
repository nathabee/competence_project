'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eleve } from '@/types/eleve';
import EleveSelection from '@/components/EleveSelection';
import EleveForm from '@/components/EleveForm';
import { useAuth } from '@/context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { isTokenExpired, getTokenFromCookies } from '@/utils/jwt';

const ElevePage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchEleves = async () => {
            const token = getTokenFromCookies();

            if (!token || isTokenExpired(token)) {
                router.push(`/login`);
                return;
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await axios.get(`${apiUrl}/eleves/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Save all élèves to the state without filtering
                setEleves(response.data);
            } catch (error) {
                console.error('Error fetching élèves:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEleves();
    }, [router]); // Removed user from dependencies since we fetch all élèves now

    // Filter élèves based on the search term
    const filteredEleves = eleves.filter(eleve =>
        `${eleve.nom} ${eleve.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create a new array with selectable state
    const elevesWithSelectableState = filteredEleves.map(eleve => ({
        ...eleve,
        selectable: eleve.professeurs_details?.some((prof) => prof.id === user?.id)
    }));

    // Handle loading and error states
    if (loading) {
        return (
            <div className="loading-indicator">
                <p>Loading élèves...</p>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <p>Error loading élèves. Please try again.</p>;
    }

    return (
        <div className="container mt-3 ml-2 eleve-page">
            <h1>Gestion des Élèves</h1>
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

                <EleveSelection eleves={elevesWithSelectableState} /> {/* Pass the updated list */}

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
            </div>
        </div>
    );
};

export default ElevePage;
