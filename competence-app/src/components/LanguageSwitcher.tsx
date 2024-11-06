// src/components/LanguageSwitcher.tsx
import React from 'react';
import i18n from 'i18next';

const LanguageSwitcher = () => {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // Store selected language in local storage
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      {/* Add buttons for other languages */}
    </div>
  );
};

export default LanguageSwitcher;





 
//import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
 
  //const { activeLanguage, setActiveLanguage } = useAuth(); // Get activeEleve and setter from AuthContext