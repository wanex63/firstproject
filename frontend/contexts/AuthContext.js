import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api'; // Это ваш экземпляр axios с настройками

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Функция для логина
  const login = async (username, password) => {
    try {
      const response = await api.post('/login/', { username, password });
      localStorage.setItem('token', response.data.token); // Сохраняем токен в localStorage
      setIsAuthenticated(true); // Обновляем состояние
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
