'use client'; // Add this line at the top
 
// src/context/AuthContext.tsx  
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { Catalogue } from '@/types/catalogue'; // Add these imports
import { Eleve } from '@/types/eleve';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null; // Add user property
  userRoles: string[];
  isLoggedIn: boolean;
  login: (token: string, userInfo: User) => void; // Update login method
  logout: () => void;
  activeCatalogue: Catalogue | null; // Add activeCatalogue
  setActiveCatalogue: (catalogue: Catalogue) => void;
  activeEleve: Eleve | null; // Add activeEleve
  setActiveEleve: (eleve: Eleve) => void;

  catalogue: Catalogue[]; // Store entire catalogue
  setCatalogue: (catalogue: Catalogue[]) => void;

  eleves: Eleve[]; // Store entire list of eleves
  setEleves: (eleves: Eleve[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCatalogue, setActiveCatalogue] = useState<Catalogue | null>(null);
  const [activeEleve, setActiveEleve] = useState<Eleve | null>(null);
  const [catalogue, setCatalogue] = useState<Catalogue[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { authToken } = parseCookies();
      if (authToken) {
        setIsLoggedIn(true);
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        setUserRoles(roles);
        const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
        setUser(savedUser);
        // Load activeCatalogue and activeEleve from localStorage
        const savedCatalogue = JSON.parse(localStorage.getItem('activeCatalogue') || 'null');
        const savedEleve = JSON.parse(localStorage.getItem('activeEleve') || 'null');
        setActiveCatalogue(savedCatalogue);
        setActiveEleve(savedEleve);
      } else {
        setIsLoggedIn(false);
        setUserRoles([]);
        setUser(null);
      }
    }
  }, []);

  const login = (token: string, userInfo: User) => {
    if (typeof window !== 'undefined') {
      setCookie(null, 'authToken', token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
      setUser(userInfo);
      setUserRoles(userInfo.roles);
      setIsLoggedIn(true);
      localStorage.setItem('userRoles', JSON.stringify(userInfo.roles));
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      destroyCookie(null, 'authToken');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userInfo');
      setUser(null);
      setUserRoles([]);
      setIsLoggedIn(false);
      setActiveCatalogue(null);
      setActiveEleve(null);
      localStorage.removeItem('activeCatalogue'); // Clear on logout
      localStorage.removeItem('activeEleve');
    }
  };

  const updateCatalogue = (newCatalogue: Catalogue[]) => {
    setCatalogue(newCatalogue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('catalogue', JSON.stringify(newCatalogue)); // Store in localStorage
    }
  };

  const updateEleves = (newEleves: Eleve[]) => {
    setEleves(newEleves);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eleves', JSON.stringify(newEleves)); // Store in localStorage
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRoles,
      isLoggedIn,
      login,
      logout,
      activeCatalogue,
      setActiveCatalogue: (catalogue: Catalogue) => {
        setActiveCatalogue(catalogue);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeCatalogue', JSON.stringify(catalogue)); // Store selected activeCatalogue
        }
      },
      activeEleve,
      setActiveEleve: (eleve: Eleve) => {
        setActiveEleve(eleve);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeEleve', JSON.stringify(eleve)); // Store selected activeEleve
        }
      },
      catalogue,
      setCatalogue: updateCatalogue,
      eleves,
      setEleves: updateEleves,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/*
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { Catalogue } from '@/types/catalogue'; // Add these imports
import { Eleve } from '@/types/eleve';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null; // Add user property
  userRoles: string[];
  isLoggedIn: boolean;
  login: (token: string, userInfo: User) => void; // Update login method
  logout: () => void;
  activeCatalogue: Catalogue | null; // Add activeCatalogue
  setActiveCatalogue: (catalogue: Catalogue) => void;
  activeEleve: Eleve | null; // Add activeEleve
  setActiveEleve: (eleve: Eleve) => void;

  catalogue: Catalogue[]; // Store entire catalogue
  setCatalogue: (catalogue: Catalogue[]) => void;

  eleves: Eleve[]; // Store entire list of eleves
  setEleves: (eleves: Eleve[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State to store user info
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCatalogue, setActiveCatalogue] = useState<Catalogue | null>(null); // State for active catalogue
  const [activeEleve, setActiveEleve] = useState<Eleve | null>(null); // State for active eleve
  const [catalogue, setCatalogue] = useState<Catalogue[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);


  useEffect(() => {
    const { authToken } = parseCookies();
    if (authToken) {
      setIsLoggedIn(true);
      const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      setUserRoles(roles);
      const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      setUser(savedUser);
    } else {
      setIsLoggedIn(false);
      setUserRoles([]);
      setUser(null);
    }
  }, []);

  const login = (token: string, userInfo: User) => {
    setCookie(null, 'authToken', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    setUser(userInfo);
    setUserRoles(userInfo.roles); // Assuming userInfo has roles
    setIsLoggedIn(true);
    localStorage.setItem('userRoles', JSON.stringify(userInfo.roles));
    localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Save user info
  };

  const logout = () => {
    destroyCookie(null, 'authToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userInfo'); // Remove user info
    setUser(null);
    setUserRoles([]);
    setIsLoggedIn(false);
    setActiveCatalogue(null); // Reset on logout
    setActiveEleve(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRoles, isLoggedIn, login, logout, 
    activeCatalogue, setActiveCatalogue, activeEleve, setActiveEleve, 
    catalogue, setCatalogue,  eleves, setEleves  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

*/