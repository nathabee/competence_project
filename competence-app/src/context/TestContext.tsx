'use client'; // Add this line at the top

// src/context/TestContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Catalogue } from '@/types/catalogue';

interface TestContextProps {
  activeCatalogue: Catalogue | null;
  setActiveCatalogue: (catalogue: Catalogue) => void;
}

const TestContext = createContext<TestContextProps | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCatalogue, setActiveCatalogue] = useState<Catalogue | null>(null);

  return (
    <TestContext.Provider value={{ activeCatalogue, setActiveCatalogue }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};




/*
export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCatalogue, setActiveCatalogue] = useState<CatalogueItem | null>(null);

  const [activeEleve, setActiveEleve] = useState(null); 
  const [activePdfInfo, setActivePdfInfo] = useState(null);
  const [activeResultat, setActiveResultat] = useState(null);
  const [aggregatedData, setAggregatedData] = useState(null);

  return (
    <TestContext.Provider
      value={{
        activeEleve,
        setActiveEleve,
        activeCatalogue,
        setActiveCatalogue,
        activePdfInfo,
        setActivePdfInfo,
        activeResultat,
        setActiveResultat,
        aggregatedData,
        setAggregatedData,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
    const context = useContext(TestContext);
    if (!context) {
      throw new Error('useTestContext must be used within a TestProvider');
    }
    return context;
  };

  */