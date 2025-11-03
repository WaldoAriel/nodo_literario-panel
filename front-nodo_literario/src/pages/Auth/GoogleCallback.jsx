import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");
      const state = urlParams.get("state");

      if (error) {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: "OAUTH_ERROR",
              error: `Error de Google: ${error}`,
            },
            window.location.origin
          );
        }
        setTimeout(() => window.close(), 2000);
        return;
      }

      if (code) {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: "OAUTH_SUCCESS",
              code: code,
              state: state,
            },
            window.location.origin
          );
          setTimeout(() => window.close(), 1000);
        } else {
          navigate(`/login?oauth_code=${code}&oauth_error=no_opener`);
        }
      } else {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: "OAUTH_ERROR",
              error: "No se recibió código de autorización",
            },
            window.location.origin
          );
        }
        setTimeout(() => window.close(), 2000);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 3,
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Procesando autenticación de Google...
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Esta ventana se cerrará automáticamente.
      </Typography>
    </Box>
  );
};

export default GoogleCallback;
