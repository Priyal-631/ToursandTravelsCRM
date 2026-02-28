import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { user, profile, loading, isAdmin } = useAuth();

  // Wait for profile to load before making any redirect decision
  if (loading || (user && !profile)) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}