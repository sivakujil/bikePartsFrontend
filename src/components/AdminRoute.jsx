
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
