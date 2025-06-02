import React  from 'react';
import   { useEffect } from 'react';
import { useAuth } from '@shared/context/AuthContext'; 
import useFetchTranslation from '@shared/api/useFetchTranslation';  // Import the custom hook


/*************************************** */
// NOT CHECKED ON WORDPRESS COMPATIBiLITY YET
/*************************************** */

const LanguageSwitcher = () => {
  const { activeLang, languageList, setActiveLang } = useAuth();

 
  const { fetchData } = useFetchTranslation();  // Get fetchData function

  // Fetch translations when activeLang changes
  useEffect(() => {
    const fetchTranslations = async () => {
      if (activeLang) {
        await fetchData();  // Call the async fetchData function
      }
    };
    fetchTranslations();  // Call the async function
  }, [activeLang]);  // Run effect when activeLang changes

 
  return (
    <select
      value={activeLang} 
      onChange={(e) => setActiveLang(e.target.value)}
    >
      {Object.entries(languageList || {}).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select> 
  );
};

export default LanguageSwitcher;
