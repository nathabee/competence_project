'use client';

 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly

export default function CustomNavbar() {
  const { userRoles, isLoggedIn, logout } = useAuth(); // Now getting 'logout' directly from context
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/evaluation'; // Set basePath

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
    logout(); // Use logout function from AuthContext
    router.push('/');
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar ${isSticky ? 'sticky-navbar navbar-small' : 'navbar-large'}`}
    >
      <Container>
        <Navbar.Brand as={Link} href="/">
          Competence App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <>
                {userRoles.includes('admin') && (
                  <Nav.Link href={process.env.NEXT_PUBLIC_ADMIN_URL}>
                    Administration
                  </Nav.Link>
                )}
                {userRoles.includes('teacher') && (
                  <>
                    <Nav.Link href={`${basePath}/configuration`}>Configuration</Nav.Link>
                    <Nav.Link href={`${basePath}/test`}>Test</Nav.Link>
                    <Nav.Link href={`${basePath}/resume`}>Resume</Nav.Link>
                    <Nav.Link href={`${basePath}/pdf`}>PDF</Nav.Link>
                  </>
                )}
                {userRoles.includes('analytics') && (
                  <Nav.Link href={`${basePath}/statistiques`}>
                    Statistiques
                    <Nav className="dropdown-menu">
                      <Nav.Link href={`${basePath}/statistiques/configuration`}>
                        Configuration Statistiques
                      </Nav.Link>
                      <Nav.Link href={`${basePath}/statistiques/pdf`}>
                        PDF Statistiques
                      </Nav.Link>
                    </Nav>
                  </Nav.Link>
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
 