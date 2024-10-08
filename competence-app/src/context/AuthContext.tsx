// src/context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { Catalogue, Report, ScoreRulePoint } from '@/types/report'; 
import { PDFLayout } from '@/types/pdf'; 
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userRoles: string[];
  isLoggedIn: boolean;
  login: (token: string, userInfo: User) => void;
  logout: () => void;

  // Handle active selection
  activeCatalogues: Catalogue[]; 
  setActiveCatalogues: (catalogues: Catalogue[]) => void;

  activeEleve: Eleve | null;
  setActiveEleve: (eleve: Eleve | null) => void;

  activeReport: Report | null; 
  setActiveReport: (report: Report | null) => void; 

  activeLayout: PDFLayout | null; 
  setActiveLayout: (layout: PDFLayout | null) => void; 


  // Handle listes
  catalogue: Catalogue[];
  setCatalogue: (catalogue: Catalogue[]) => void;

  eleves: Eleve[];
  setEleves: React.Dispatch<React.SetStateAction<Eleve[]>>;

  layouts: PDFLayout[]; // Array of all available layouts
  setLayouts: (layouts: PDFLayout[]) => void; // Setter for layouts

  // Store score rule points
  scoreRulePoints: ScoreRulePoint[] | null;  
  setScoreRulePoints: (points: ScoreRulePoint[]) => void; 

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCatalogues, setActiveCatalogues] = useState<Catalogue[]>([]);
  const [activeEleve, setActiveEleve] = useState<Eleve | null>(null);
  const [catalogue, setCatalogue] = useState<Catalogue[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [scoreRulePoints, setScoreRulePoints] = useState<ScoreRulePoint[] | null>(null); 
  const [activeReport, setActiveReport] = useState<Report | null>(null); 
  const [activeLayout, setActiveLayout] = useState<PDFLayout | null>(null); 
  const [layouts, setLayouts] = useState<PDFLayout[]>([]); 


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { authToken } = parseCookies();
      if (authToken) {
        setIsLoggedIn(true);
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        setUserRoles(roles);
        const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
        setUser(savedUser);
        
        // Load state from localStorage
        const savedCatalogues = JSON.parse(localStorage.getItem('activeCatalogues') || '[]');
        const savedEleve = JSON.parse(localStorage.getItem('activeEleve') || 'null');
        const savedReport = JSON.parse(localStorage.getItem('activeReport') || 'null'); 
        const savedLayout = JSON.parse(localStorage.getItem('activeLayout') || 'null');
        const savedLayouts = JSON.parse(localStorage.getItem('layouts') || '[]');  


        setActiveCatalogues(savedCatalogues);
        setActiveEleve(savedEleve);
        setActiveReport(savedReport);
        setActiveLayout(savedLayout);
        setLayouts(savedLayouts); 
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
      setActiveCatalogues([]);
      setActiveEleve(null);
      setActiveReport(null);
      setActiveLayout(null);
      localStorage.removeItem('activeCatalogues');
      localStorage.removeItem('activeEleve');
      localStorage.removeItem('activeReport');
      localStorage.removeItem('activeLayout');
      localStorage.removeItem('layouts'); 
    }
  };

  const updateCatalogue = (newCatalogue: Catalogue[]) => {
    setCatalogue(newCatalogue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('catalogue', JSON.stringify(newCatalogue)); 
    }
  };

  const updateEleves: React.Dispatch<React.SetStateAction<Eleve[]>> = (newEleves) => {
    if (typeof newEleves === 'function') {
      setEleves((prevEleves) => newEleves(prevEleves));
    } else {
      setEleves(newEleves);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('eleves', JSON.stringify(newEleves));
    }
  };

  const updateLayout =  (layout: PDFLayout | null) => {
      setActiveLayout(layout);
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeLayout', JSON.stringify(layout));
      }
    }
 



  const updateScoreRulePoints = (points: ScoreRulePoint[]) => { 
    setScoreRulePoints(points);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoreRulePoints', JSON.stringify(points)); 
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRoles,
      isLoggedIn,
      login,
      logout,
      activeCatalogues,
      setActiveCatalogues: (catalogues: Catalogue[]) => {
        setActiveCatalogues(catalogues);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeCatalogues', JSON.stringify(catalogues));
        }
      },
      activeEleve,
      setActiveEleve: (eleve: Eleve | null) => {
        setActiveEleve(eleve);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeEleve', JSON.stringify(eleve));
        }
      },
      catalogue,
      setCatalogue: updateCatalogue,
      eleves,
      setEleves: updateEleves,
      scoreRulePoints,
      setScoreRulePoints: updateScoreRulePoints,
      activeReport,
      setActiveReport: (report: Report | null) => {
        setActiveReport(report);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeReport', JSON.stringify(report));
        }
      },
      activeLayout,
      setActiveLayout: updateLayout,
      layouts,  
      setLayouts: (layouts: PDFLayout[]) => {
        setLayouts(layouts);
        if (typeof window !== 'undefined') {
          localStorage.setItem('layouts', JSON.stringify(layouts));  
        }
      },
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
