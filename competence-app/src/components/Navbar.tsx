'use client'; // Ensure this runs on the client-side

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
import { formatDate } from '@/utils/helper';
import '../app/globals.css'; // Import global styles  
import Image from 'next/image'; // Import Image from next/image
import DynamicHelpDrawer from '@/components/DynamicHelpDrawer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

import useTranslation from '@/utils/translationHelper';


export default function Navbar() {
  const { userRoles, isLoggedIn, logout,
    activeCatalogues, activeEleve, activeLayout, activeReport } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const router = useRouter();
  const  t = useTranslation();
  //const basePath = process.env.NEXT_PUBLIC_BASE_PATH  || ""; 

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
    router.push('/home');
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
        {isLoggedIn ? (
        <div className="navbar-active-data">
          {/* Eleve section */} 
          <div>
          {t('nav_Stud')}:
            {activeEleve ? (
              `${activeEleve.nom} ${activeEleve.prenom}`
            ) : (
              <span className="warning-message" onClick={() => handleRedirect('/eleve')}>{t('nav_chooseStud')}</span>
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
              <p className="warning-message" onClick={() => handleRedirect('/configuration')}>{t('nav_chooseConf')}</p>
            )}
          </div>

          {/* Catalogue section */}
          <div className="catalogue-container">
            { activeCatalogues && activeCatalogues.length > 0 ? (
              activeCatalogues.map(cat => (
                <div key={cat.id} className="catalogue-item">
                  {cat.description}
                </div>
              ))
            ) : (
              <p className="warning-message" onClick={() => handleRedirect('/catalogue')}>{t('nav_chooseCtg')}</p>
            )}
          </div>

          {/* Report section */}
          <div>
            {activeReport ? (
              <>
               {t('tbH_rptId')}: {activeReport.id} | {t('tbH_createdAt')}: {formatDate(activeReport.created_at)}
              </>
            ) : (
              activeEleve && activeLayout && activeCatalogues && activeCatalogues.length > 0 ? (
                <p className="warning-message" onClick={() => handleRedirect('/test')}>{t('nav_chooseRpt')}</p>
              ) : (
                ""
              )
            )}
          </div>
          <div><LanguageSwitcher/></div>
          <div>
          <DynamicHelpDrawer    /> 
          </div>
        </div> ) : (<div/>) }

        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {isSidebarOpen && <h2>{t('nav_menu')}</h2>} {/* Only show Menu when sidebar is open */}

          <Nav className="flex-column">
            {isLoggedIn ? (
              <>
                {userRoles.includes('admin') && (
                  <Nav.Link onClick={() => { toggleSidebar();handleRedirect(`/admin`)}}>Console administration</Nav.Link>
                )}
                {userRoles.includes('teacher') && (
                  <>
                  <Nav.Link onClick={() => { toggleSidebar(); handleRedirect(`/dashboard`)}}>{t('pgH_histo')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/eleve`)}}>{t('pgH_studMgmt')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/configuration`)}}>{t('pgH_confMgmt')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/catalogue`)}}>{t('pgH_ctgMgmt')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/test`)}}>{t('pgH_rptMgmt')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/overview`)}}>{t('pgH_overview')} </Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/pdf`)}}>{t('pgH_PDF')}</Nav.Link>
                  <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/pdfimage`)}}>{t('pgH_iconPDF')}</Nav.Link>
 
                  </>
                )}
                {userRoles.includes('analytics') && (
                  <>
                   <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/statistiques/configuration`)}}>
                      Configuration Statistiques
                    </Nav.Link>
                    <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/statistiques/pdf`)}}>PDF Statistiques</Nav.Link>
                  </>
                )}
                <Nav.Link onClick={handleLogout}>{t('pgH_logout')}</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() =>  { toggleSidebar(); handleRedirect(`/login`)}}>{t('pgH_login')}</Nav.Link>
            )}
            
          </Nav>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}
