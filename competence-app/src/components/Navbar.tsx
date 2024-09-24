'use client';

 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly

export default function CustomNavbar() {
  const { userRoles, isLoggedIn, logout } = useAuth(); // Now getting 'logout' directly from context
  const [isSticky, setIsSticky] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
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
          Home
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
                {userRoles.includes('analytics') && (                  <>
                    {/* Mega menu on hover */}
                    <div
                      className="nav-item dropdown"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <Nav.Link href={`${basePath}/statistiques`}>
                      statistiques Menu
                      </Nav.Link>
                      {isHovered && (
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
                  </>
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
 