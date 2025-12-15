import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const RiderProtectedRoute = ({ children }) => {
  const riderToken = localStorage.getItem('riderToken');

  // If no rider token, redirect to login
  if (!riderToken) {
    return <Navigate to="/rider/login" replace />;
  }

  // If token exists, render children (no loading state needed since we're not fetching data)
  return children;
};

export default RiderProtectedRoute;