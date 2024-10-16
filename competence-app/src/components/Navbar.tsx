'use client'; // Ensure this runs on the client-side

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
import { formatDate } from '../utils/helper';
import '../app/globals.css'; // Import global styles  
import Image from 'next/image'; // Import Image from next/image

export default function Navbar() {
  const { userRoles, isLoggedIn, logout,
    activeCatalogues, activeEleve, activeLayout, activeReport } = useAuth();
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

  // Function to handle redirection
  const handleRedirect = (path: string) => {
    router.push(`${path}`);
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

        {/* Flex container for active data */}
        <div className="navbar-active-data">
          {/* Eleve section */} 
          <div>
            Eleve:
            {activeEleve ? (
              `${activeEleve.nom} ${activeEleve.prenom}`
            ) : (
              <span className="warning-message" onClick={() => handleRedirect('/eleve')}>Choisir un eleve</span>
            )}
          </div>

          {/* Layout section */}
          <div>
            {activeLayout ? (
              <div>
                {activeLayout.header_icon_base64 && (
                  <Image
                    src={`${activeLayout.header_icon_base64}`}   // MIME included in imageBase64
                    alt="Header Icon"
                    height={20} // Specify height
                    style={{ marginRight: '10px' }} // Inline styles for margin
                  />
                )} {activeLayout.schule_name} 
              </div>
            ) : (
              <p className="warning-message" onClick={() => handleRedirect('/configuration')}>Choisir une configuration</p>
            )}
          </div>

          {/* Catalogue section */}
          <div className="catalogue-container">
            {activeCatalogues && activeCatalogues.length > 0 ? (
              activeCatalogues.map(cat => (
                <div key={cat.id} className="catalogue-item">
                  {cat.description}
                </div>
              ))
            ) : (
              <p className="warning-message" onClick={() => handleRedirect('/catalogue')}>Choisir un catalogue</p>
            )}
          </div>

          {/* Report section */}
          <div>
            {activeReport ? (
              <>
                Report ID: {activeReport.id} | Created At: {formatDate(activeReport.created_at)}
              </>
            ) : (
              activeEleve && activeLayout && activeCatalogues && activeCatalogues.length > 0 ? (
                <p className="warning-message" onClick={() => handleRedirect('/test')}>Choisir de modifier ou de créer un report</p>
              ) : (
                ""
              )
            )}
          </div>
        </div>

        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <h2>Menu</h2>
          <Nav className="flex-column">
            {isLoggedIn ? (
              <>
                {userRoles.includes('admin') && (
                  <Nav.Link href={`${basePath}/admin`}>Console administrtation</Nav.Link>
                )}
                {userRoles.includes('teacher') && (
                  <>
                    <Nav.Link href={`${basePath}/dashboard`}>Historique</Nav.Link>
                    <Nav.Link href={`${basePath}/eleve`}>Gestion des élèves</Nav.Link>
                    <Nav.Link href={`${basePath}/configuration`}>Configuration du PDF</Nav.Link>
                    <Nav.Link href={`${basePath}/catalogue`}>Gestion du catalogue de tests</Nav.Link>
                    <Nav.Link href={`${basePath}/test`}>Gestion des rapports</Nav.Link>
                    <Nav.Link href={`${basePath}/overview`}>Résumé des tests en cours</Nav.Link>
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
