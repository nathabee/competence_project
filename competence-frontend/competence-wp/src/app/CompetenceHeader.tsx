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
              <Link to="/competence_student_mgt" className="nav-link">👨‍🎓 Student Management</Link>                
              <Link to="/competence_pdf_conf" className="nav-link">🛠️ PDF Setup</Link>                      
              <Link to="/competence_catalogue_mgt" className="nav-link">📚 Catalogue Management</Link>               
              <Link to="/competence_report_mgt" className="nav-link">	📄 Report Management</Link>             
              <Link to="/competence_overview_test" className="nav-link">🧪 Ongoing Tests</Link>           
              <Link to="/competence_pdf_view" className="nav-link">🖨️ PDF Viewer</Link>    
              <Link to="/competence_error" className="nav-link">⚠️ Error</Link>
              <button className="navbar-button" onClick={logout}>🔓 Logout</button>
            </>
          ) : (
            <Link to="/competence_login" className="nav-link">🔓 Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CompetenceHeader;

 