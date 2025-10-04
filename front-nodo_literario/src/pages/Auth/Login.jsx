import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/"); // manda al home después del login exitoso
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #006D77 0%, #00474E 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              Nodo Literario
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Iniciar Sesión
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Ingresa a tu cuenta de Nodo Literario
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
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
              disabled={loading}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                backgroundColor: "#00474E",
                "&:hover": {
                  backgroundColor: "#006D77",
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>
          </Box>

          {/* Enlace al registro - Manteniendo la funcionalidad original */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{" "}
              <Button
                component="a"
                href="/registro"
                variant="text"
                size="small"
                sx={{ color: "primary.main" }}
              >
                Regístrate aquí
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
