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
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAdminAuth();
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
      // Usar fetch directo para admin (sesión separada)
      const response = await fetch(
        "http://localhost:3000/api/admin/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        adminLogin(data.tokens, {
          id: data.usuario.id,
          email: data.usuario.email,
          tipo: "administrador",
          rol: data.rol,
        });

        // Redirigir al panel admin
        navigate("/admin");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #006D77 0%, #00474E 100%)",
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
              Panel de Administración
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Acceso exclusivo para administradores
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
              {loading ? <CircularProgress size={24} /> : "Acceder al Panel"}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              ¿Eres cliente?{" "}
              <Button
                component="a"
                href="/"
                variant="text"
                size="small"
                sx={{ color: "primary.main" }}
              >
                Ir al sitio público
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
