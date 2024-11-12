"use client";

// __tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import EleveDisplay from '../src/components/EleveDisplay';
import { Eleve } from '../src/types/eleve';
import eleves from '../src/demo/data/json/eleves.json';
import { useAuth } from '../src/context/AuthContext';
import defaultTranslation from '@/utils/defaultTranslation.json';

// Mock the Auth context
jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Use the first item from the imported JSON data as mockEleve1
const mockEleve1: Eleve = eleves[0];

describe('EleveProfile Component', () => {
  beforeEach(() => {
    // Mocking Auth Context including language and translation setup
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: ['teacher'],
      isLoggedIn: true,
      logout: jest.fn(),
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
      activeLang: 'en',
      setActiveLang: jest.fn(),
      translations: defaultTranslation,
      setTranslations: jest.fn(),
      languageList: {
        en: 'English',
        fr: 'Français',
        de: 'Deutsch',
        br: 'Breton',
      },
      setLanguageList: jest.fn(),
    });
  });

  it('renders user data correctly', () => {
    render(<EleveDisplay eleve={mockEleve1} />);

    expect(screen.getByText(new RegExp(mockEleve1.nom, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockEleve1.professeurs_details[0].last_name, 'i'))).toBeInTheDocument();
  });
});
