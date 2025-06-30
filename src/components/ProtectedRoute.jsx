import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/dashboard/main" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'receptionist':
        return <Navigate to="/clinic/dashboard" replace />;
      default:
        return <Navigate to="/dashboard/main" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;