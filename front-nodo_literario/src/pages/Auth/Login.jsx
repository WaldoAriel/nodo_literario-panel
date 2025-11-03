import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/GoogleAuthButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/google");
      const data = await response.json();

      const width = 600;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const popup = window.open(
        data.authUrl,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error(
          "No se pudo abrir la ventana emergente. Por favor, permite ventanas emergentes para este sitio."
        );
      }

      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "OAUTH_SUCCESS") {
          processOAuthCode(event.data.code);
        } else if (event.data.type === "OAUTH_ERROR") {
          setError(event.data.error);
          setGoogleLoading(false);
          if (popup && !popup.closed) popup.close();
        }
      };

      const processOAuthCode = async (code) => {
        try {
          const result = await loginWithGoogle(code);
          if (result.success) {
            if (popup && !popup.closed) popup.close();
            window.removeEventListener("message", handleMessage);
          } else {
            setError(result.error);
          }
        } catch (err) {
          setError(err.message || "Error en autenticación con Google");
        } finally {
          setGoogleLoading(false);
        }
      };

      window.addEventListener("message", handleMessage);

      const popupCheck = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheck);
          window.removeEventListener("message", handleMessage);
          if (googleLoading) {
            setGoogleLoading(false);
            setError(
              "La ventana de autenticación se cerró inesperadamente. Por favor, intentá nuevamente."
            );
          }
        }
      }, 500);

      setTimeout(() => {
        clearInterval(popupCheck);
      }, 120000);
    } catch (err) {
      setError(err.message || "Error al iniciar autenticación con Google");
      setGoogleLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <GoogleAuthButton
            onClick={handleGoogleLogin}
            loading={googleLoading}
          />

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box
              sx={{ flexGrow: 1, height: "1px", backgroundColor: "grey.300" }}
            />
            <Typography variant="body2" sx={{ mx: 2, color: "grey.600" }}>
              o
            </Typography>
            <Box
              sx={{ flexGrow: 1, height: "1px", backgroundColor: "grey.300" }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to="/registro" variant="body2">
              ¿No tienes cuenta? Regístrate
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
