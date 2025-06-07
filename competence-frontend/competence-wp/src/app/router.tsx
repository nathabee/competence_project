// src/app/router.tsx
 

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CompetenceHome from '@pages/CompetenceHome';
import CompetenceLogin from '@pages/CompetenceLogin';
import CompetenceDashboard from '@pages/CompetenceDashboard';
import CompetenceError from '@pages/CompetenceError';

const AppRoutes = () => (
  <Routes>
    
    <Route path="/competence_home" element={<CompetenceHome />} />
    <Route path="/competence_login" element={<CompetenceLogin />} />
    <Route path="/competence_dashboard" element={<CompetenceDashboard />} />
    <Route path="/competence_error" element={<CompetenceError />} />

    <Route path="/"  element={<CompetenceHome />} />
  </Routes>
);

export default AppRoutes;
 