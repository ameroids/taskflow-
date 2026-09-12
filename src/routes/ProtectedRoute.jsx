import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/Loading';

export default function ProtectedRoute({ role, children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  }
  return children;
}
