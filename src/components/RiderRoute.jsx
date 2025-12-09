import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import { CircularProgress, Box } from '@mui/material';

const RiderRoute = ({ children }) => {
  const { rider, loading } = useRiderAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return rider ? children : <Navigate to="/rider/login" replace />;
};

export default RiderRoute;