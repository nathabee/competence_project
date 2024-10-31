// __tests__/ElevePage.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ElevePage from '../src/app/eleve/page';
import eleves from '../src/demo/data/eleves.json';
import niveaux from '../src/demo/data/niveaux.json';
import axios from 'axios';
import { AuthProvider } from '@/context/AuthContext';
import MockAdapter from 'axios-mock-adapter';
import { useRouter } from 'next/navigation';
import { getTokenFromCookies, isTokenExpired } from '@/utils/jwt';

// Mock axios
const mockAxios = new MockAdapter(axios);

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/jwt', () => ({
  getTokenFromCookies: jest.fn(() => 'mockToken'),
  isTokenExpired: jest.fn(() => false),
}));

describe('ElevePage Component', () => {
  console.log('API URL in __tests__/ElevePage.test.tsx:', process.env.NEXT_PUBLIC_API_URL);
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    // Set up axios mocks for API responses
    mockAxios.onGet(`${process.env.NEXT_PUBLIC_API_URL}/eleves/`).reply(200, eleves);
    mockAxios.onGet(`${process.env.NEXT_PUBLIC_API_URL}/niveaux/`).reply(200, niveaux);

    // Mock router functionality
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Mock token to be valid by default
    (getTokenFromCookies as jest.Mock).mockReturnValue('mockToken');
    (isTokenExpired as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('redirects to login if token is expired', async () => {
    // Simulate an expired token
    (isTokenExpired as jest.Mock).mockReturnValue(true);

    render(
      <AuthProvider>
        <ElevePage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    });
  });

  it('renders eleves data correctly when token is valid', async () => {
    render(
      <AuthProvider>
        <ElevePage />
      </AuthProvider>
    );

    // Wait for the eleves data to load and check if it's displayed correctly
    await waitFor(() => {
      expect(screen.getByText(/Gestion des Élèves/i)).toBeInTheDocument();
      console.log('look for eleves[0].nom', eleves[0].nom);
      expect(screen.getByText(new RegExp(eleves[0].nom, 'i'))).toBeInTheDocument();
    });
  });

  it('displays an error message on failed data fetch', async () => {
    // Mock failed responses for eleves and niveaux endpoints
    mockAxios.onGet(`${process.env.NEXT_PUBLIC_API_URL}/eleves/`).networkError();
    mockAxios.onGet(`${process.env.NEXT_PUBLIC_API_URL}/niveaux/`).networkError();

    // Mock console.error to suppress its output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
        <AuthProvider>
            <ElevePage />
        </AuthProvider>
    );

    // Use findByText to wait for the error message to appear
    const errorMessage = await screen.findByText(/Erreur chargement des élèves. Recommencez SVP./i);
    expect(errorMessage).toBeInTheDocument();

    // Verify that console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Adjust the expectation to check for both arguments
    expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erreur lors de la récupération des données:'),
        expect.any(Error) // Checks that the second argument is any Error object
    );

    // Restore the original implementation of console.error
    consoleErrorSpy.mockRestore();
});

});
