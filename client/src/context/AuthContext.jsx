import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STAFF_ROLES = new Set(['super_admin', 'admin', 'faculty', 'team_member']);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res?.data?.user || null);
    } catch {
      localStorage.removeItem('fcit_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res?.data?.token) {
      localStorage.setItem('fcit_token', res.data.token);
    }
    setUser(res?.data?.user || null);
    return res?.data?.user;
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    if (res?.data?.token) {
      localStorage.setItem('fcit_token', res.data.token);
    }
    setUser(res?.data?.user || null);
    return res?.data?.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      localStorage.removeItem('fcit_token');
      setUser(null);
    }
  };

  const isStaff = Boolean(user && STAFF_ROLES.has(user.role));

  return (
    <AuthContext.Provider
      value={{ user, loading, isStaff, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
