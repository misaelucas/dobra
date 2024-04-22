import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const ProtectedRoute = ({ element: Element, roles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Element />;
}

export default ProtectedRoute;
