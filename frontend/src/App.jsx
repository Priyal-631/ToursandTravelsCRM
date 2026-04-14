import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Index';
import ReportsPage from './pages/Dashboard/Reports/ReportsPage';
import CustomerManagement from './pages/CustomerManagement/Index';
import QueriesPage from './pages/Queries/index';
import EnquiryForm from './pages/Public/EnquiryForm';

export default function App() {
  return (
    <Routes>

      {/* ── Redirect root → login ───────────────────────────────── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Public ─────────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={
          <div style={{ padding: '2rem' }}>
            ⛔ You are not authorized to view this page.
          </div>
        }
      />

      {/* ── Admin only (role: ADMIN) ────────────────────────────── */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard"  element={<Dashboard />} />
        <Route path="/admin/customers"  element={<CustomerManagement />} />
        <Route path="/admin/reports"    element={<ReportsPage />} />
        {/* Queries page — wired but EnquiryForm not added yet per spec */}
        <Route path="/admin/queries"    element={<QueriesPage />} />
      </Route>

      {/* ── Sales (role: MANAGER | EXECUTIVE | ACCOUNTS + ADMIN) ── */}
      <Route element={<SalesLayout />}>
        <Route path="/sales/reports" element={<ReportsPage />} />
        <Route path="/sales/queries" element={<QueriesPage />} />
      </Route>

      <Route path="/enquiry" element={<EnquiryForm />} />

      {/* ── Fallback ────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      
    </Routes>
  );
}