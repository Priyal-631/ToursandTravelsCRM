import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import AdminLayout from "./layouts/AdminLayout";
import SalesLayout from "./layouts/SalesLayout";

import Login from "./pages/Auth/Analytics/Login";
import Unauthorized from "./pages/Auth/Analytics/Unauthorized";
import Dashboard from "./pages/Auth/Dashboard/Index";
import Analytics from "./pages/Auth/Analytics/index";

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>

      {/* Public */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" replace />}
      />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>

      {/* Sales */}
      <Route element={<SalesLayout />}>
        <Route path="/sales/dashboard" element={<Analytics />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          !user
            ? <Navigate to="/login" replace />
            : profile?.role === "ADMIN"
              ? <Navigate to="/admin/analytics" replace />
              : <Navigate to="/sales/dashboard" replace />
        }
      />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}