'use client'; // Mark this as a Client Component

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home after logging out
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'var(--custom-blue)' }}>
      <div className="container">
        <div className="row w-100">
          <div className="col-sm-4">
            <Link className="navbar-brand" href="/">Competence App</Link>
          </div>
          <div className="col-sm-8">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" href="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/login">Administration</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard">Evaluation</Link>
                </li>
                {isLoggedIn && (
                  <li className="nav-item">
                    <button className="btn btn-outline-light nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
