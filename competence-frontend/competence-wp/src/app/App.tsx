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
