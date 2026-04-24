import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load session on app start
  useEffect(() => {
    checkAuth();
  }, []);

  // -------------------------
  // CHECK AUTH SESSION
  // -------------------------
  async function checkAuth() {
    try {
      setLoading(true);

      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // important for cookies
      });

      if (!res.ok) {
        setUser(null);
        setProfile(null);
        return;
      }

      const data = await res.json();

      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // LOGIN
  // -------------------------
  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();

    setUser(data.user);
    setProfile(data.profile);
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  // -------------------------
  // ROLE HELPERS
  // -------------------------
  const isAdmin = profile?.role === 'ADMIN';
  const isManager = profile?.role === 'MANAGER';
  const isExecutive = profile?.role === 'EXECUTIVE';
  const isAccounts = profile?.role === 'ACCOUNTS';

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    isAdmin,
    isManager,
    isExecutive,
    isAccounts,
    refreshAuth: checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// -------------------------
// HOOK
// -------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}