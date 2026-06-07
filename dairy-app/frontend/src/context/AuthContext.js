// src/context/AuthContext.js
// Provides { user, token, login, logout, isRole } to entire app

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);  // true while hydrating from localStorage

  // ── Hydrate from localStorage on mount ─────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('dairy_token');
    const savedUser  = localStorage.getItem('dairy_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Login — store token + user ──────────────────────────────
  const login = (tokenStr, userData) => {
    localStorage.setItem('dairy_token', tokenStr);
    localStorage.setItem('dairy_user',  JSON.stringify(userData));
    setToken(tokenStr);
    setUser(userData);
  };

  // ── Logout ──────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('dairy_token');
    localStorage.removeItem('dairy_user');
    setToken(null);
    setUser(null);
  };

  // ── Refresh user profile from API ───────────────────────────
  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      localStorage.setItem('dairy_user', JSON.stringify(data));
    } catch {
      logout();
    }
  };

  // ── Convenience role checker ─────────────────────────────────
  const isRole = (...roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
