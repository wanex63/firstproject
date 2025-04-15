import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/profile/');
          setUser(data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/register/', { username, email, password });
      localStorage.setItem('token', data.token);
      const userRes = await api.get('/profile/');
      setUser(userRes.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/login/', { username, password });
      localStorage.setItem('token', data.token);
      const userRes = await api.get('/profile/');
      setUser(userRes.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);