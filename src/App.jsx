import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';
import Login from './pages/Auth/Login';

// Temporary dashboard to test auth
function TempDashboard() {
  const { profile, logout } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>✅ Logged in successfully!</h2>
      <p>Name: {profile?.full_name}</p>
      <p>Email: {profile?.email}</p>
      <p>Role: {profile?.role}</p>
      <button
        onClick={logout}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>

      {/* ─── Public Routes ─────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={<div style={{ padding: '2rem' }}>⛔ You are not authorized to view this page.</div>}
      />

      {/* ─── Admin Only (role: ADMIN) ───────────────────────────────── */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<TempDashboard />} />
        <Route path="/admin/analytics" element={<div style={{ padding: '2rem' }}>Analytics Page</div>} />
        <Route path="/admin/customers" element={<div style={{ padding: '2rem' }}>Customers Page</div>} />
        <Route path="/admin/reports" element={<div style={{ padding: '2rem' }}>Reports Page</div>} />
      </Route>

      {/* ─── Sales (role: MANAGER, EXECUTIVE, ACCOUNTS + ADMIN) ────── */}
      <Route element={<SalesLayout />}>
        <Route path="/sales/crm" element={<div style={{ padding: '2rem' }}>CRM Page</div>} />
        <Route path="/sales/crm/:id" element={<div style={{ padding: '2rem' }}>Lead Detail Page</div>} />
        <Route path="/sales/dashboard" element={<TempDashboard />} />
      </Route>

      {/* ─── Fallback ───────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}