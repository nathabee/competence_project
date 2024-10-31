"use client";

// __tests__/NavBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../src/components/Navbar'; // Adjust the import path as necessary
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'next/navigation'; // Next.js 15.2 router
 



// Mock the Auth context and Next.js router
jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/mocked/path'), // Mocked pathname
}));



describe('Navbar Component', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it('toggles sidebar visibility when hamburger icon is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: ['teacher'],
      isLoggedIn: true,
      logout: jest.fn(),
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
    });

    render(<Navbar />);

    // Check that the sidebar is closed initially
    expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument(); // Expect "Menu" to not be in the document

    // Click the hamburger icon to open the sidebar
    const hamburgerIcon = screen.getByLabelText(/Toggle Sidebar/i);
    fireEvent.click(hamburgerIcon);

    // Now the sidebar should be visible
    expect(screen.getByText(/Menu/i)).toBeInTheDocument(); // Expect "Menu" to be in the document

    // Click again to close
    fireEvent.click(hamburgerIcon);
    expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument(); // Sidebar should be closed again
  });

  it('renders correctly when user is logged in as teacher', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: ['teacher'],
      isLoggedIn: true,
      logout: jest.fn(),
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
    });

    render(<Navbar />);

    // Assert the presence of 'Historique' link for the teacher role
    expect(screen.getByText(/Historique/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('renders correctly when user is logged in as admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: ['admin'],
      isLoggedIn: true,
      logout: jest.fn(),
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
    });

    render(<Navbar />);

    // Assert the presence of admin links
    expect(screen.getByText(/Console administration/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it('renders login link when user is not logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: [],
      isLoggedIn: false,
      logout: jest.fn(),
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
    });

    render(<Navbar />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    const logoutMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      userRoles: ['admin'],
      isLoggedIn: true,
      logout: logoutMock,
      activeCatalogues: [],
      activeEleve: null,
      activeLayout: null,
      activeReport: null,
    });

    render(<Navbar />);
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalled(); // Ensure logout function was called
    expect(mockRouterPush).toHaveBeenCalledWith('/'); // Expect redirection after logout
  });
});
