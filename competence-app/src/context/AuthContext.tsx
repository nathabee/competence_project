// src/context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { Catalogue, Report, ScoreRulePoint } from '@/types/report';
import { PDFLayout } from '@/types/pdf';
import { Eleve } from '@/types/eleve';
import { User } from '@/types/user';
// import { getOrFetchBase64Image } from '@/utils/helper';
import { fetchBase64Image } from '@/utils/helper'; // Import the new function

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

  // Handle lists
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
  const [activeReport, setActiveReportState] = useState<Report | null>(null); // Rename state setter
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
      
      // Clear local storage entries related to active selections
      localStorage.removeItem('activeCatalogues');
      localStorage.removeItem('activeEleve');
      localStorage.removeItem('activeReport');
      localStorage.removeItem('activeLayout');
      localStorage.removeItem('layouts');

      // Remove all Base64 images with competence_ prefix
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('competence') && 
            (key.endsWith('.png') || 
             key.endsWith('.jpg') || 
             key.endsWith('.jpeg') || 
             key.endsWith('.gif'))) {
          localStorage.removeItem(key);
        }
      });
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

  const updateLayout = (layout: PDFLayout | null) => {
    setActiveLayout(layout);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeLayout', JSON.stringify(layout));
    }
  };

  const updateScoreRulePoints = (points: ScoreRulePoint[]) => {
    setScoreRulePoints(points);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoreRulePoints', JSON.stringify(points));
    }
  };

  const setActiveReport = async (report: Report | null) => {
    if (report) {
      console.log("Fetching Base64 images for report...");
      console.log(report);
  
      try {
        // Fetch Base64 images for each result
        await Promise.all(
          report.report_catalogues.flatMap(async (catalogue) =>
            Promise.all(
              catalogue.resultats.map(async (resultat) => {
                // Check if the groupage_icon is present
                if (resultat.groupage.groupage_icon) {
                  const imageKey = `competence_groupage_icon_${resultat.groupage.id}`; // Constructed imageKey
  
                  // Use the new fetchBase64Image function to fetch and store the image
                  await fetchBase64Image(imageKey, resultat.groupage.groupage_icon);
                }
                return resultat; // Return original resultat
              })
            )
          )
        );
  
        // Update the report without base64 images in resultats
        const updatedReport = {
          ...report,
          report_catalogues: report.report_catalogues.map((catalogue) => ({
            ...catalogue,
            resultats: catalogue.resultats, // Keep original resultats
          })),
        };
  
        // Store in state and localStorage
        setActiveReportState(updatedReport); // Internal state setter
        if (typeof window !== 'undefined') {
          localStorage.setItem('activeReport', JSON.stringify(updatedReport));
        }
      } catch (error) {
        console.error("Error while setting active report:", error);
        // Optionally handle the error further, like displaying a notification to the user
      }
    } else {
      // Clear the state and localStorage if no report
      setActiveReportState(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeReport');
      }
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
      setActiveReport,
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
