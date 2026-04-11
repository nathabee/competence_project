'use client';

import { useAuth } from '@/context/AuthContext';
import { getTokenFromCookies, isTokenExpired } from '@/utils/jwt';
import axios from 'axios';

const useFetchTranslation = () => {
    const { setTranslations, setLanguageList, activeLang } = useAuth();

    const fetchData = async () => {
        const token = getTokenFromCookies();

        if (!token || isTokenExpired(token)) {
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await axios.get(`${apiUrl}/translations?lang=${activeLang}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { language_list, ...translationData } = response.data;
            const parsedLanguageList = JSON.parse(language_list.replace(/'/g, '"'));

            setTranslations(translationData);
            setLanguageList(parsedLanguageList || {});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return { fetchData };
};

export default useFetchTranslation;