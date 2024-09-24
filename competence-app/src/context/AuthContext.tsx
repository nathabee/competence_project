'use client'; // Add this line at the top

// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // State to store user info
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  };

  return (
    <AuthContext.Provider value={{ user, userRoles, isLoggedIn, login, logout }}>
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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

interface AuthContextType {
  userRoles: string[];
  isLoggedIn: boolean;
  login: (token: string, roles: string[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { authToken } = parseCookies();
    if (authToken) {
      setIsLoggedIn(true);
      const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      setUserRoles(roles);
    } else {
      setIsLoggedIn(false);
      setUserRoles([]);
    }
  }, []);

  const login = (token: string, roles: string[]) => {
    setCookie(null, 'authToken', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    setUserRoles(roles);
    setIsLoggedIn(true);
    localStorage.setItem('userRoles', JSON.stringify(roles));
  };

  const logout = () => {
    destroyCookie(null, 'authToken');
    localStorage.removeItem('userRoles');
    setUserRoles([]);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userRoles, isLoggedIn, login, logout }}>
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