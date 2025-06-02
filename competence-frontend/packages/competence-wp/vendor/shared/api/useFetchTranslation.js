'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useAuth } from '@shared/context/AuthContext';
import { getToken, isTokenExpired } from '@shared/utils/jwt';
import axios from 'axios';
const useFetchTranslation = () => {
    const { setTranslations, setLanguageList, activeLang } = useAuth(); // Correct the function name to 'setTranslations'
    const fetchData = async () => {
        const token = getToken();
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
            const _a = response.data, { language_list } = _a, translationData = __rest(_a, ["language_list"]); // Extract language_list
            // Parse language_list string into an object
            const parsedLanguageList = JSON.parse(language_list.replace(/'/g, '"'));
            //const parsedLanguageList = typeof language_list === 'string'
            //? JSON.parse(language_list.replace(/'/g, '"'))
            //: language_list;
            //console.log("useFetchTranslation translationData", translationData);
            setTranslations(translationData); // Set translations only
            //console.log("useFetchTranslation parsedLanguageList", parsedLanguageList);
            setLanguageList(parsedLanguageList || {}); // Set language list separately
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    return { fetchData }; // Return the fetch function
};
export default useFetchTranslation;
