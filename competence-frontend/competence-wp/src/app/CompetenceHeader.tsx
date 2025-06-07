// src/app/CompetenceHeader.tsx
import React from 'react';
import { useAuth } from '@context/AuthContext';
import { Link } from 'react-router-dom';


 
const CompetenceHeader = () => {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <nav className="navbar sticky-navbar">
      <div className="navbar-container">
        <div className="navbar-active-data">
          <Link to="/competence_home" className="nav-link">🏠 Home</Link>

          {isLoggedIn ? (
            <>
              <Link to="/competence_dashboard" className="nav-link">📊 Dashboard</Link>
              <Link to="/competence_error" className="nav-link">Error</Link>
              <button className="navbar-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/competence_login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CompetenceHeader;

