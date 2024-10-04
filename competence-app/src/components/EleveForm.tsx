'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eleve } from '@/types/eleve'; // Assuming Eleve is correctly defined
import { User } from '@/types/user'; // Assuming User is correctly defined

interface EleveFormProps {
    setEleves: React.Dispatch<React.SetStateAction<Eleve[]>>; // Allowing setEleves to accept both Eleve[] and a function
    closeForm: () => void;
}

const EleveForm: React.FC<EleveFormProps> = ({ setEleves, closeForm }) => {
    const [nom, setNom] = useState<string>('');
    const [prenom, setPrenom] = useState<string>('');
    const [niveau, setNiveau] = useState<string>('');
    const [datenaissance, setDatenaissance] = useState<Date | null>(null);
    const [selectedProfesseurs, setSelectedProfesseurs] = useState<number[]>([]); // Array of selected User IDs
    const [availableProfesseurs, setAvailableProfesseurs] = useState<User[]>([]); // Array of available professors

    useEffect(() => {
        const fetchProfesseurs = async () => {
            const token = document.cookie.split('authToken=')[1];
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await axios.get(`${apiUrl}/users/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                // Filter professors with at least one teacher role
                const filteredProfesseurs = response.data.filter((user: User) => 
                    user.roles.includes('teacher') // Adjust the role condition as necessary
                );
                setAvailableProfesseurs(filteredProfesseurs);
            } catch (error) {
                console.error('Error fetching professors:', error);
            }
        };

        fetchProfesseurs();
    }, []);

    const handleProfesseurChange = (selectedIds: number[]) => {
        setSelectedProfesseurs(selectedIds);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = document.cookie.split('authToken=')[1];
        const formattedDate = datenaissance ? datenaissance.toISOString().split('T')[0] : null;


        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            console.log("create eleve nom ", nom)
            console.log("create eleve prenom ", prenom)
            console.log("create eleve niveau ", niveau)
            console.log("create eleve datenaissance ", formattedDate)
            console.log("create eleve professeurs ", selectedProfesseurs)
            const response = await axios.post(`${apiUrl}/eleves/`, {
                nom,
                prenom,
                niveau,
                formattedDate,
                professeurs: selectedProfesseurs, // Send the list of selected professor IDs
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update eleves state with the newly created eleve
            setEleves((prev: Eleve[]) => [...prev, response.data as Eleve]);
            closeForm(); // Close the form after submission
        } catch (error) {
            console.error('Error creating eleve:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label>Nom:</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Prénom:</label>
                <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Niveau:</label>
                <input type="text" value={niveau} onChange={e => setNiveau(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label>Date de Naissance:</label>
                <input type="date" value={datenaissance ? datenaissance.toISOString().substring(0, 10) : ''} onChange={e => setDatenaissance(e.target.value ? new Date(e.target.value) : null)} required />
            </div>
            <div className="mb-3">
                <label>Professeurs:</label>
                <select 
                    multiple 
                    value={selectedProfesseurs.map(String)} // Convert IDs to strings for the select value
                    onChange={e => handleProfesseurChange(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                >
                    {availableProfesseurs.map(prof => (
                        <option key={prof.id} value={prof.id}>
                            {prof.username} - {prof.first_name} {prof.last_name} ({prof.roles.join(', ')})
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Ajouter Élève</button>
            <button type="button" className="btn btn-secondary" onClick={closeForm}>Annuler</button>
        </form>
    );
};

export default EleveForm;
