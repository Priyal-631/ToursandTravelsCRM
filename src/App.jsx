import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';

import Login from './pages/Auth/Login';
import Dashboard from './pages/Auth/Dashboard/Index';
import Analytics from './pages/Auth/Analytics/index';
import Unauthorized from './pages/Auth/Unauthorized';

export default function App() {
  const { user, profile, loading } = useAuth();

  // Block all route rendering until Supabase session + profile are resolved
  if (loading) return null;

  return (
    <Routes>

      {/* ── Public ── */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Admin routes (Dashboard + Analytics) ── */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>

      {/* ── Sales routes (Dashboard only) ── */}
      <Route element={<SalesLayout />}>
        <Route path="/sales/dashboard" element={<Dashboard />} />
      </Route>

      {/* ── Root redirect based on role ── */}
      <Route
        path="/"
        element={
          !user
            ? <Navigate to="/login" replace />
            : profile?.role === 'ADMIN'
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/sales/dashboard" replace />
        }
      />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
