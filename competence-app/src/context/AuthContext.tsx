'use client'; // Add this line at the top

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


/*
import React, { createContext, useContext, useState } from 'react';
import {  setCookie } from 'nookies';

interface AuthContextType {
  userRoles: string[];
  isLoggedIn: boolean;
  login: (token: string, roles: string[]) => void;
  logout: () => void;
  setUserRoles: (roles: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (token: string) => {
    setCookie(null, 'authToken', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  
    // Decode the token and extract roles
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Assuming JWT structure
    const roles = decodedToken.roles || []; // Extract roles from the token payload
  
    setUserRoles(roles);
    setIsLoggedIn(true);
    localStorage.setItem('userRoles', JSON.stringify(roles));
  };
  

  const logout = () => {
    setUserRoles([]);
    setIsLoggedIn(false);
    document.cookie = 'authToken=; Max-Age=0'; // Delete the authToken cookie
    localStorage.removeItem('userRoles');
  };

  return (
    <AuthContext.Provider value={{ userRoles, isLoggedIn, login, logout, setUserRoles }}>
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


/*import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie } from 'nookies';

interface AuthContextType {
  userRoles: string[];
  isLoggedIn: boolean;
  setUserRoles: (roles: string[]) => void;
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
    document.cookie = 'authToken=; Max-Age=0';
    localStorage.removeItem('userRoles');
    setUserRoles([]);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userRoles, isLoggedIn, setUserRoles, login, logout }}>
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