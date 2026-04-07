import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Roles that are allowed into the Sales section
const SALES_ROLES = ['MANAGER', 'EXECUTIVE', 'ACCOUNTS'];

export default function SalesLayout() {
  const { user, profile, loading, isAdmin } = useAuth();

  // Wait for profile to load before making any redirect decision
  if (loading || (user && !profile)) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;

  // Admin can access everything, sales roles get their own layout
  const hasAccess = isAdmin || SALES_ROLES.includes(profile?.role);
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}