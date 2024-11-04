// src/hooks/useFetchData.ts
'use client';


import { useAuth } from '@/context/AuthContext';
import { getTokenFromCookies, isTokenExpired } from '@/utils/jwt'; 
import axios from 'axios';
import { ScoreRulePoint  } from '@/types/report';

const useFetchData = () => {
    const { catalogue, setCatalogue, layouts, setLayouts,  niveaux, setNiveaux,
        scoreRulePoints,  setScoreRulePoints
     } = useAuth();

    const fetchData = async () => {
        const token = getTokenFromCookies();
        const time = new Date().toLocaleTimeString('de-DE', { hour12: false });

        console.log("fetchData time",time);

        if (!token || isTokenExpired(token)) {
            console.log("fetchData token expired out");
            return; // Handle token validation as needed
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            //console.log("fetchData tgoing to init catalogue layouts");

            // Fetch Catalogues only if they are not already set
            if (catalogue.length === 0) {
                const response = await axios.get(`${apiUrl}/catalogues/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                //console.log('useFetchData catalogue:', response.data);
                console.log('useFetchData catalogue');
                setCatalogue(response.data);
            }

            if (layouts.length === 0) {
                const layoutsResponse = await axios.get(`${apiUrl}/pdf_layouts/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                //console.log("get layoutsResponse ", layoutsResponse.data)
                console.log('useFetchData layouts');
                setLayouts(layoutsResponse.data);
            }


            // Fetch Niveaux and store them in context/localStorage
            if (!niveaux || niveaux.length === 0) {
                const niveauResponse = await axios.get(`${apiUrl}/niveaux/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }); 
                //console.log("get niveauResponse ", niveauResponse.data)
                console.log('useFetchData niveaux');
                setNiveaux(niveauResponse.data); // Save in AuthContext and localStorage
            }


            if (!scoreRulePoints || scoreRulePoints.length === 0) {
                const scoreRuleResponse = await axios.get<ScoreRulePoint[]>(`${apiUrl}/scorerulepoints/`, {
                headers: { Authorization: `Bearer ${token}` },
                });
                //console.log('Fetched scoreRuleResponse:', scoreRuleResponse.data);
                console.log('useFetchData scoreRulePoints');
                setScoreRulePoints(scoreRuleResponse.data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return { fetchData }; // Return the fetch function
};

export default useFetchData;
