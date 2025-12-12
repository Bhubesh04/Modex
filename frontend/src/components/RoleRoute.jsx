import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {allowedRoles.includes(user?.role) ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
};

export default RoleRoute;


