// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { Catalogue, Report, ScoreRulePoint ,ReportCatalogue,Resultat} from '@/types/report';
import { PDFLayout } from '@/types/pdf';
import { Eleve, Niveau } from '@/types/eleve';
import { User } from '@/types/user';  
import { fetchBase64Image } from '@/utils/helper';  

import { getTokenFromCookies, isTokenExpired } from '@/utils/jwt';



interface AuthContextType {
  user: User | null;
  userRoles: string[];
  isLoggedIn: boolean; 

  login: (token: string, userInfo: User) => void;
  logout: () => void;

  activeCatalogues: Catalogue[];
  setActiveCatalogues: (catalogues: Catalogue[]) => void;

  activeEleve: Eleve | null;
  setActiveEleve: (eleve: Eleve | null) => void;

  activeReport: Report | null;
  setActiveReport: (report: Report | null) => void;

  activeLayout: PDFLayout | null;
  setActiveLayout: (layout: PDFLayout | null) => void;

  catalogue: Catalogue[];
  setCatalogue: (catalogue: Catalogue[]) => void;

  eleves: Eleve[];
  setEleves: React.Dispatch<React.SetStateAction<Eleve[]>>;

  layouts: PDFLayout[];
  setLayouts: (layouts: PDFLayout[]) => void;

  scoreRulePoints: ScoreRulePoint[] | null;
  setScoreRulePoints: (points: ScoreRulePoint[]) => void;

  niveaux: Niveau[] | null;
  setNiveaux: (niveaux: Niveau[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, internalSetUser] = useState<User | null>(null);
  const [userRoles, internalSetUserRoles] = useState<string[]>([]);
  const [isLoggedIn, internalSetIsLoggedIn] = useState(false);
  const [activeCatalogues, internalSetActiveCatalogues] = useState<Catalogue[]>([]);
  const [activeEleve, internalSetActiveEleve] = useState<Eleve | null>(null); 
  const [catalogue, internalSetCatalogue] = useState<Catalogue[]>([]);
  const [eleves, internalSetEleves] = useState<Eleve[]>([]);
  const [scoreRulePoints, internalSetScoreRulePoints] = useState<ScoreRulePoint[] | null>(null);
  const [activeReport, internalSetActiveReport] = useState<Report | null>(null);
  const [activeLayout, internalSetActiveLayout] = useState<PDFLayout | null>(null);
  const [layouts, internalSetLayouts] = useState<PDFLayout[]>([]);
  const [niveaux, internalSetNiveaux] = useState<Niveau[] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { authToken } = parseCookies();
      if (authToken) {
        internalSetIsLoggedIn(true); 
        const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        internalSetUserRoles(roles);
        const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
        internalSetUser(savedUser);
        const savedNiveaux = JSON.parse(localStorage.getItem('niveaux') || '[]');
        internalSetNiveaux(savedNiveaux);

        const savedCatalogues = JSON.parse(localStorage.getItem('activeCatalogues') || '[]');
        const savedEleve = JSON.parse(localStorage.getItem('activeEleve') || 'null');
        const savedReport = JSON.parse(localStorage.getItem('activeReport') || 'null');
        const savedLayout = JSON.parse(localStorage.getItem('activeLayout') || 'null');
        const savedLayouts = JSON.parse(localStorage.getItem('layouts') || '[]');

        internalSetActiveCatalogues(savedCatalogues);
        internalSetActiveEleve(savedEleve);
        internalSetActiveReport(savedReport);
        internalSetActiveLayout(savedLayout);
        internalSetLayouts(savedLayouts);
      } else {
        logout(); 
      }
    }
  }, []);

  // retrieve image whenever new report is active
  useEffect(() => {
    const token = getTokenFromCookies();
    if (token && activeReport) {
      console.log("authentify ok going to fetch data" );
      const fetchImages = async () => {
        try {
          await Promise.all(
            activeReport.report_catalogues.map(async (reportCatalogue: ReportCatalogue) => {
              await Promise.all(
                reportCatalogue.resultats.map(async (resultat: Resultat) => {
                  if (resultat.groupage.groupage_icon_id) {
                    const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`;
                    console.log("call fetchBase64Image with imageKey",imageKey) 
                    await fetchBase64Image(imageKey, resultat.groupage.groupage_icon_id, token);
                  }
                })
              );
            })
          );
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };

      fetchImages();
    } else if (!token || isTokenExpired(token)) {
      console.error("Token is either missing or expired.");
      // Handle the token expiration logic here
    }
  }, [activeReport]); // Run effect when activeReport changes

  const login = (token: string, userInfo: User) => {
    if (typeof window !== 'undefined') {
      setCookie(null, 'authToken', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      }); 
      internalSetUser(userInfo);
      internalSetUserRoles(userInfo.roles);
      internalSetIsLoggedIn(true);
      localStorage.setItem('userRoles', JSON.stringify(userInfo.roles));
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      destroyCookie(null, 'authToken');
      internalSetIsLoggedIn(false); 
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('activeCatalogues');
      localStorage.removeItem('activeReport');
      localStorage.removeItem('activeEleve');
      localStorage.removeItem('activeReport');
      localStorage.removeItem('activeLayout');
      localStorage.removeItem('eleves');
      localStorage.removeItem('catalogue');
      localStorage.removeItem('niveaux');
      localStorage.removeItem('layouts'); 
      localStorage.removeItem('scoreRulePoints');
      localStorage.removeItem('scoreRulePoints');
      internalSetIsLoggedIn(false);
      internalSetUser(null);
      internalSetUserRoles([]);
      internalSetActiveCatalogues([]);
      internalSetActiveEleve(null);
      internalSetActiveReport(null);
      internalSetActiveLayout(null);
      internalSetCatalogue([]);
      internalSetEleves([]);
      internalSetLayouts([]);
      internalSetScoreRulePoints([]);
      // Remove all items from local storage that start with 'competence_'
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('competence_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.clear();
    }
  };

 

  const setCatalogue = (newCatalogue: Catalogue[]) => {
    internalSetCatalogue(newCatalogue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('catalogue', JSON.stringify(newCatalogue));
    }
  };

  const setEleves: React.Dispatch<React.SetStateAction<Eleve[]>> = (newEleves) => {
    if (typeof newEleves === 'function') {
      internalSetEleves((prevEleves) => newEleves(prevEleves));
    } else {
      internalSetEleves(newEleves);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('eleves', JSON.stringify(newEleves));
    }
  };

  const setActiveLayout = (layout: PDFLayout | null) => {
    internalSetActiveLayout(layout);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeLayout', JSON.stringify(layout));
    }
  };

  const setScoreRulePoints = (points: ScoreRulePoint[]) => {
    internalSetScoreRulePoints(points);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoreRulePoints', JSON.stringify(points));
    }
  };

  const setActiveReport = (report: Report | null) => {
    if (report) {
      const updatedReport = {
        ...report,
        report_catalogues: report.report_catalogues.map((catalogue) => ({
          ...catalogue,
          resultats: catalogue.resultats,
        })),
      };

      internalSetActiveReport(updatedReport);
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeReport', JSON.stringify(updatedReport));
      }
    } else {
      internalSetActiveReport(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeReport');
      }
    }
  };

  const setNiveaux = (newNiveaux: Niveau[]) => {
    internalSetNiveaux(newNiveaux);
    if (typeof window !== 'undefined') {
      localStorage.setItem('niveaux', JSON.stringify(newNiveaux));
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
        internalSetActiveCatalogues(catalogues);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeCatalogues', JSON.stringify(catalogues));
        }
      },
      activeEleve,
      setActiveEleve: (eleve: Eleve | null) => {
        internalSetActiveEleve(eleve);
        setActiveReport(null);
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeEleve', JSON.stringify(eleve));
          localStorage.removeItem('activeReport');
        }
      },
      catalogue,
      setCatalogue,
      eleves,
      setEleves,
      scoreRulePoints,
      setScoreRulePoints,
      activeReport,
      setActiveReport,
      activeLayout,
      setActiveLayout,
      layouts,
      setLayouts: (layouts: PDFLayout[]) => {
        internalSetLayouts(layouts);
        if (typeof window !== 'undefined') {
          localStorage.setItem('layouts', JSON.stringify(layouts));
        }
      },
      niveaux,
      setNiveaux,
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
