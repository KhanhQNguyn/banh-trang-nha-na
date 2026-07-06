import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Admin route requires role to be admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
