import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactElement;
  requireSubscription?: boolean;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireSubscription = false,
  adminOnly = false,
}) => {
  const { isAuthenticated, hasActiveSubscription, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/subscription" replace />;
  }

  return children;
};

export default PrivateRoute;