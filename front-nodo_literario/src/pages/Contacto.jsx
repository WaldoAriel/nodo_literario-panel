import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  LocalShipping,
  Send,
} from "@mui/icons-material";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus("loading");

    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    }, 2000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          Contactanos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          ¿Tenés preguntas sobre nuestros libros, envíos o necesitás ayuda con
          tu pedido?
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Columna izquierda - Información de contacto */}
        <Grid sx={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Email */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Email sx={{ fontSize: 35, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Email
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  consultas@nodo-literario.com
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Respondemos en menos de 24 horas
                </Typography>
              </CardContent>
            </Card>

            {/* Teléfono */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Phone sx={{ fontSize: 35, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Teléfono
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  (3546) 45 38 19
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Lunes a Viernes de 9:00 a 18:00
                </Typography>
              </CardContent>
            </Card>

            {/* Dirección */}
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <LocationOn
                  sx={{ fontSize: 35, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Dirección
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{ fontSize: "0.9rem" }}
                >
                  Chile y Jaime Dávalos
                  <br />
                  Santa Rosa de Calamuchita, Córdoba
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Showroom para retiro en persona
                </Typography>
              </CardContent>
            </Card>

            {/* Horarios */}
            <Card
              sx={{ borderRadius: 2, bgcolor: "primary.main", color: "white" }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <AccessTime sx={{ fontSize: 35, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Horarios
                </Typography>
                <Typography variant="body1">
                  Lunes a Viernes: 9:00 - 18:00
                </Typography>
                <Typography variant="body1">Sábados: 10:00 - 14:00</Typography>
                <Chip
                  label="Cerrado Domingos"
                  sx={{
                    mt: 1,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Columna derecha - Formulario */}
        <Grid sx={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              textAlign="center"
            >
              Envianos tu consulta
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
              textAlign="center"
            >
              Completa el formulario y te responderemos a la brevedad.
            </Typography>

            {submitStatus === "success" && (
              <Alert severity="success" sx={{ mb: 3 }}>
                ¡Mensaje enviado correctamente! Te contactaremos dentro de las
                próximas 24 horas.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={formData.nombre}
                  onChange={handleChange("nombre")}
                  required
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange("telefono")}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Asunto"
                  value={formData.asunto}
                  onChange={handleChange("asunto")}
                  required
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Mensaje"
                  multiline
                  rows={4}
                  value={formData.mensaje}
                  onChange={handleChange("mensaje")}
                  required
                  size="small"
                />

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    disabled={submitStatus === "loading"}
                    sx={{ minWidth: 200 }}
                  >
                    {submitStatus === "loading"
                      ? "Enviando..."
                      : "Enviar Mensaje"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Información de envíos */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              mt: 3,
              background: "linear-gradient(135deg, #00474E 0%, #006B76 100%)",
              color: "white",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid sx={{ xs: 8 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                  🚚 Envío Gratis
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", opacity: 0.9 }}
                >
                  En compras mayores a $15.000
                  <br />
                  • Córdoba: 24-48h
                  <br />• Resto del país: 3-7 días
                </Typography>
              </Grid>
              <Grid sx={{ xs: 4 }} textAlign="center">
                <LocalShipping
                  sx={{ fontSize: 50, color: "white", opacity: 0.8 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contacto;
