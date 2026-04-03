import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getValidatedStoredToken } from '../utils/authToken';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const token = getValidatedStoredToken();

  if (!user || !token) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Not an admin, redirect to home
    alert('Access denied. Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  // User is admin, render the component
  return children;
};

export default AdminRoute;
