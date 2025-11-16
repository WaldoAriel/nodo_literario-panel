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
import { useAuth } from "../../hooks/useAuth";
import GoogleAuthButton from "../../components/GoogleAuthButton";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    tipo_cliente: "regular",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error inesperado al registrar usuario");
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
            Crear Cuenta
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
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="given-name"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
                autoComplete="family-name"
                value={formData.apellido}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              fullWidth
              id="telefono"
              label="Teléfono"
              name="telefono"
              autoComplete="tel"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              helperText="Mínimo 6 caracteres"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Crear Cuenta"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to="/login" variant="body2">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
