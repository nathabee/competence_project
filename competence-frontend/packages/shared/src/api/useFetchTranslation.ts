'use client';

import { useAuth } from '@shared/context/AuthContext';
import { getToken , isTokenExpired } from '@shared/utils/jwt';
import axios from 'axios';

const useFetchTranslation = () => {  // Use 'string' instead of 'String'
    const { setTranslations,setLanguageList,activeLang } = useAuth();  // Correct the function name to 'setTranslations'

    const fetchData = async () => {
        const token = getToken ();
        //const time = new Date().toLocaleTimeString('de-DE', { hour12: false });
  

        //console.log("fetchTranslation time", time, "lang=", activeLang);

        // Handle token expiration
        if (!token || isTokenExpired(token)) {
            console.log("fetchData token expired out");
            return; // Handle token validation as needed
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            // Make the API request to fetch translations
            const response = await axios.get(`${apiUrl}/translations?lang=${activeLang}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log('useFetchTranslation response  :', response.data);
 

            const { language_list, ...translationData } = response.data; // Extract language_list
        
            // Parse language_list string into an object
            const parsedLanguageList = JSON.parse(language_list.replace(/'/g, '"'));
            //const parsedLanguageList = typeof language_list === 'string'
            //? JSON.parse(language_list.replace(/'/g, '"'))
            //: language_list;
            
            //console.log("useFetchTranslation translationData", translationData);
            setTranslations(translationData);  // Set translations only
            //console.log("useFetchTranslation parsedLanguageList", parsedLanguageList);
            setLanguageList(parsedLanguageList || {});  // Set language list separately


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return { fetchData }; // Return the fetch function
};

export default useFetchTranslation;
