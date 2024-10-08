'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly
//import { usePathname } from 'next/navigation'; // Import usePathname

export default function CustomNavbar() {
  const { userRoles, isLoggedIn, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isAdminHovered, setIsAdminHovered] = useState(false);
  const [isAnalyticsHovered, setIsAnalyticsHovered] = useState(false);
  const router = useRouter();
  //const pathname = usePathname(); // Use usePathname hook
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

  return (
    <Navbar expand="lg" fixed="top" className={`navbar ${isSticky ? 'sticky-navbar' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} href="/">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav"> 
          <Nav className="me-auto">
            {isLoggedIn ? (
              <>
                {userRoles.includes('admin') && (
                  <div
                    className="nav-item dropdown"
                    onMouseEnter={() => setIsAdminHovered(true)}
                    onMouseLeave={() => setIsAdminHovered(false)}
                  >
                    <Nav.Link href={`${basePath}/admin`}>
                      Administration Menu
                    </Nav.Link>
                    {isAdminHovered && (
                      <div className="mega-menu">
                        {/*<Nav.Link href={`${basePath}/admin/user`}>Users</Nav.Link>
                        <Nav.Link href={`${basePath}/admin/eleve`}>Eleves</Nav.Link>
                        <Nav.Link href={process.env.NEXT_PUBLIC_ADMIN_URL}>Django Admin Console</Nav.Link>*/}
                        <Nav.Link href={`${basePath}/admin`}>admin console</Nav.Link>
                      </div>
                    )}
                  </div>
                )}
                {userRoles.includes('teacher') && (
                  <>
                    <Nav.Link href={`${basePath}/dashboard`}>Dashboard</Nav.Link>
                    <Nav.Link href={`${basePath}/configuration`}>Configuration</Nav.Link>
                    <Nav.Link href={`${basePath}/test`} >Test</Nav.Link>  
                    <Nav.Link href={`${basePath}/overview`}>overview</Nav.Link>
                    <Nav.Link href={`${basePath}/pdf`}>PDF</Nav.Link>
                  </>
                )}
                {userRoles.includes('analytics') && (
                  <div
                    className="nav-item dropdown"
                    onMouseEnter={() => setIsAnalyticsHovered(true)}
                    onMouseLeave={() => setIsAnalyticsHovered(false)}
                  >
                    <Nav.Link href={`${basePath}/statistiques`}>
                      Statistiques Menu
                    </Nav.Link>
                    {isAnalyticsHovered && (
                      <div className="mega-menu">
                        <Nav.Link href={`${basePath}/statistiques/configuration`}>
                          Configuration Statistiques
                        </Nav.Link>
                        <Nav.Link href={`${basePath}/statistiques/pdf`}>
                          PDF Statistiques
                        </Nav.Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Nav.Link href={`${basePath}/login`}>Login</Nav.Link>
            )}
          </Nav>
          {isLoggedIn && (
            <Nav className="ml-auto">
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
