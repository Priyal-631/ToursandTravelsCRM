import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';
import Login from './pages/Auth/Login';
import Dashboard from "./pages/Dashboard/Index"; 
import ReportsPage from './pages/Dashboard/Reports/ReportsPage';
import { useAuth } from './hooks/useAuth';


export default function App() {
  return (
    <Routes>

      {/* ─── Redirect root to login ──────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ─── Public Routes ───────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={<div style={{ padding: '2rem' }}>⛔ You are not authorized to view this page.</div>}
      />

      {/* ─── Admin Only (role: ADMIN) ─────────────────────────────────── */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/customers" element={<div style={{ padding: '2rem' }}>Customers Page</div>} />
        <Route path="/admin/reports"   element={<ReportsPage />} />
        <Route path="/admin/queries"   element={<div style={{ padding: '2rem' }}>Queries Page</div>} />
      </Route>

      {/* ─── Sales (role: MANAGER, EXECUTIVE, ACCOUNTS + ADMIN) ──────── */}
      <Route element={<SalesLayout />}>
        <Route path="/sales/reports" element={<ReportsPage />} />
        <Route path="/sales/queries" element={<div style={{ padding: '2rem' }}>Queries Page</div>} />
      </Route>

      {/* ─── Fallback ─────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}