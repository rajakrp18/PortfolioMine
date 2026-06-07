// src/components/ProtectedRoute.js
// Wraps routes that require authentication.
// If roles prop given, also enforces role-based access.
//
// Usage:
//   <Route element={<ProtectedRoute />}>           — any logged-in user
//   <Route element={<ProtectedRoute roles={['admin']} />}> — admin only

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  // Still hydrating localStorage — show nothing briefly
  if (loading) return null;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role guard
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
