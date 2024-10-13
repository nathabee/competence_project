// src/components/Navbar.tsx
'use client'; // Ensure this runs on the client-side

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
import '../app/globals.css'; // Import global styles

export default function Navbar() {
  const { userRoles, isLoggedIn, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/evaluation';

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  return (
    <BootstrapNavbar expand="true" fixed="top" className={`navbar ${isSticky ? 'sticky-navbar' : ''}`}>
      <Container>
        <button
          className="hamburger-icon ml-2"
          onClick={toggleSidebar} // Toggle the sidebar when clicked
          aria-label="Toggle Sidebar"
        >
          &#9776; {/* Hamburger icon */}
        </button>

        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <h2>Menu</h2>
          <Nav className="flex-column">
            {isLoggedIn ? (
              <>
                {userRoles.includes('admin') && (
                  <Nav.Link href={`${basePath}/admin`}>Admin Console</Nav.Link>
                )}
                {userRoles.includes('teacher') && (
                  <>
                    <Nav.Link href={`${basePath}/eleve`}>Gestion des eleves</Nav.Link>
                    <Nav.Link href={`${basePath}/dashboard`}>Dashboard</Nav.Link>
                    <Nav.Link href={`${basePath}/configuration`}>Configuration</Nav.Link>
                    <Nav.Link href={`${basePath}/test`}>Test</Nav.Link>
                    <Nav.Link href={`${basePath}/overview`}>Overview</Nav.Link>
                    <Nav.Link href={`${basePath}/pdf`}>PDF</Nav.Link>
                    <Nav.Link href={`${basePath}/pdfimage`}>PDF avec pictogrammes</Nav.Link>
                  </>
                )}
                {userRoles.includes('analytics') && (
                  <>
                    <Nav.Link href={`${basePath}/statistiques/configuration`}>
                      Configuration Statistiques
                    </Nav.Link>
                    <Nav.Link href={`${basePath}/statistiques/pdf`}>PDF Statistiques</Nav.Link>
                  </>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link href={`${basePath}/login`}>Login</Nav.Link>
            )}
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}
