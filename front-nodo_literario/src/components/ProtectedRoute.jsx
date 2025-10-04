import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, loading } = useAuth();
  const { admin, isAdminAuthenticated, loading: adminLoading } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Si estamos verificando autenticación, mostrar loading
  if (loading || (requireAdmin && adminLoading)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // RUTAS ADMIN
  if (requireAdmin) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // Lógica para rutas normales (clientes)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}