import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

export function NeedRole({ roles }) {
  const { hasRole } = useAuth();
  if (!hasRole(...roles)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
