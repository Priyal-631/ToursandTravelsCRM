import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — check if a token exists and restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient('/api/auth/me')
        .then(profile => {
          setUser({ id: profile.id });
          setProfile(profile);
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const { token, profile } = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', token);
    setUser({ id: profile.id });
    setProfile(profile);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  }

  const isAdmin     = profile?.role === 'ADMIN';
  const isManager   = profile?.role === 'MANAGER';
  const isExecutive = profile?.role === 'EXECUTIVE';
  const isAccounts  = profile?.role === 'ACCOUNTS';

  const value = {
    user, profile, loading,
    login, logout,
    isAdmin, isManager, isExecutive, isAccounts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}