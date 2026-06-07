// src/pages/DashboardRouter.js
// Smart redirect based on logged-in user's role

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  admin:          '/admin',
  farmer:         '/farmer',
  wholesaler:     '/shop',
  retailer:       '/shop',
  consumer:       '/shop',
  delivery_agent: '/agent',
};

const DashboardRouter = () => {
  const { user } = useAuth();
  const dest = ROLE_HOME[user?.role] || '/login';
  return <Navigate to={dest} replace />;
};

export default DashboardRouter;
