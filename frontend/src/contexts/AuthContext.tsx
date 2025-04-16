'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { clientApi } from '@/lib/client-api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const user = await clientApi.getProfile();
      setUser(user);
    } catch {
      setUser(null);
    }
  };

  const login = async (credentials) => {
    const { user, token } = await clientApi.login(credentials);
    localStorage.setItem('authToken', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);