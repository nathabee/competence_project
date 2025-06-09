import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CompetenceHeader from '@app/CompetenceHeader';
import AppRoutes from '@app/router';

// Redirect if at root
if (window.location.pathname === '/') {
  window.history.replaceState({}, '', '/competence_home');
}

const App = () => {
  useEffect(() => {
    // Avoid duplicate script loading
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      // Define the callback function
      window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'fr,en',
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Force default translation after a delay
        setTimeout(() => {
          setDefaultLanguage('French');
        }, 1000);
      };

    }
  }, []);

  return (
    <BrowserRouter basename={window.competenceSettings?.basename || '/'}>
      {/* Add the translation box anywhere you want */}
      <div className="translate-box" style={{ padding: '10px', textAlign: 'right' }}>
        🌐 Translate: <span id="google_translate_element"></span>
      </div>

      <CompetenceHeader />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;













/*
// src/app/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CompetenceHeader from '@app/CompetenceHeader';
import AppRoutes from '@app/router';


// Redirect to /competence_home if current URL is exactly '/'
if (window.location.pathname === '/') {
  window.history.replaceState({}, '', '/competence_home');
}


const App = () => (
  <BrowserRouter basename={window.competenceSettings?.basename || '/'}>
    <CompetenceHeader />
    <AppRoutes />
  </BrowserRouter>
);

export default App;
*/