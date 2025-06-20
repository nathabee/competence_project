'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Assuming you have an authentication context
import { Eleve } from '@/types/eleve'; // Import the Eleve type
import { User } from '@/types/user'; // Import the User type for professors
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { isTokenExpired, getTokenFromCookies } from  '@/utils/jwt';  // Import JWT utility functions

import useTranslation from '@/utils/translationHelper';

interface EleveFormProps {
    setEleves: React.Dispatch<React.SetStateAction<Eleve[]>>; // Updated type for setEleves to accept functional updates
    closeForm: () => void;
}

const EleveForm: React.FC<EleveFormProps> = ({ setEleves, closeForm }) => {
    const { user, niveaux } = useAuth(); // Get the current logged-in user (teacher/admin)
    const router = useRouter(); // Router for navigation
    const [nom, setNom] = useState<string>('');
    const [prenom, setPrenom] = useState<string>('');
    const [niveau, setNiveau] = useState<string>('');
    const [selectedProfesseurs, setSelectedProfesseurs] = useState<string[]>([]); // State for selected professeurs (admin only)
    const [availableProfesseurs, setAvailableProfesseurs] = useState<User[]>([]); // State for available professeurs (admin only)
    const t = useTranslation();


    // Calculate the date 5 years ago from today
    const today = new Date();
    const fiveYearsAgo = new Date(today.setFullYear(today.getFullYear() - 5)).toISOString().split('T')[0];

    const [datenaissance, setDateNaissance] = useState<string>(fiveYearsAgo); // Set initial state to today - 5 years

    // Fetch the available professors if the user is an admin
    useEffect(() => {
        const fetchProfesseurs = async () => {
            const token = getTokenFromCookies(); // Get the token from cookies
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            // Check if the token is expired
            if (!token || isTokenExpired(token)) {
                router.push(`/login`); // Redirect to login if token is not valid
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/users/?role=teacher`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                //console.log('Fetched users_role_teacher:', response.data);
                setAvailableProfesseurs(response.data); // Assuming the API returns a list of users with the role 'teacher'
            } catch (error) {
              console.error(t('msg_loadErr'), error);
            }
        };

        if (user?.roles.includes('admin')) {
            fetchProfesseurs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, router]); // Include router in dependencies

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getTokenFromCookies(); // Get the token from cookies
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Check if the token is expired
        if (!token || isTokenExpired(token)) {
            router.push(`/login`); // Redirect to login if token is not valid
            return;
        }

        try {
            // Prepare the payload for the API request
            const payload = {
                nom,
                prenom,
                niveau,
                datenaissance,
                // Only send professeurs if the user is an admin
                ...(user?.roles.includes('admin') && { professeurs: selectedProfesseurs }),
            };

            const response = await axios.post(`${apiUrl}/eleves/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newEleve: Eleve = response.data; // Type the API response as Eleve

            // Correctly update the eleves state with the functional form
            setEleves((prevEleves) => [...prevEleves, newEleve]); // This is the functional update version for setState

            closeForm(); // Close the form after successful submission
        } catch (error) {
            console.error(t('msg_errCreateStud'), error);
        }
    };


  return (
    <form onSubmit={handleSubmit}>
      <h1>{t('pgH_formStudent')}</h1> 
      <div className="form-group">
        <label>{t('frm_name')}</label>
        <input
          type="text"
          className="form-control"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          placeholder={t('msg_req')}
        />
      </div>

      <div className="form-group">
        <label>{t('frm_first')}</label>
        <input
          type="text"
          className="form-control"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          placeholder={t('msg_req')}
        />
      </div>

      <div className="form-group">
        <label>{t('frm_level')}</label>
        <select
          className="form-control"
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          required
        >
          <option value="" disabled>{t('frm_chooseLvl')}</option>
          {niveaux?.map((niveau) => (
            <option key={niveau.id} value={niveau.id}>
              {t(niveau.description)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t('frm_birthDt')}</label>
        <input
          type="date"
          className="form-control"
          value={datenaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          required
          placeholder={t('msg_req')}
        />
      </div>

      {user?.roles.includes('admin') && (
        <div className="form-group">
          <label>{t('frm_prof')}</label>
          <select
            multiple
            className="form-control"
            onChange={(e) =>
              setSelectedProfesseurs(Array.from(e.target.selectedOptions, option => option.value))
            }
          >
            {availableProfesseurs.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.last_name} {prof.first_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-3">
        {t('frm_createStud')}
      </button>
    </form>
  );
};

export default EleveForm;