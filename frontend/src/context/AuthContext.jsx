import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('puii_token'));
  const [user, setUser] = useState(() => (token ? { email: localStorage.getItem('puii_user') } : null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('puii_token', token);
    } else {
      localStorage.removeItem('puii_token');
    }
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      setToken(data.token);
      setUser({ email });
      localStorage.setItem('puii_user', email);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setToken(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('puii_user');
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: Boolean(token),
  }), [token, user, login, logout, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
