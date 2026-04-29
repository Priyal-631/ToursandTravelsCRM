import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import SalesLayout from './layouts/SalesLayout';
import Login from './pages/Auth/Login';
import Dashboard from "./pages/Dashboard/Index"; 
import ReportsPage from './pages/Dashboard/Reports/ReportsPage';
import CustomerManagementPage from './pages/CustomerManagement/Index';
import QueriesPage from './pages/Queries/Index';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route
        path="/unauthorized"
        element={<div style={{ padding: '2rem' }}>You are not authorized to view this page.</div>}
      />

      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/customers" element={<CustomerManagementPage />} />
        <Route path="/admin/reports"   element={<ReportsPage />} />
        <Route path="/admin/queries"   element={<QueriesPage />} />
      </Route>

      <Route element={<SalesLayout />}>
        <Route path="/sales/reports" element={<ReportsPage />} />
        <Route path="/sales/queries" element={<QueriesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}