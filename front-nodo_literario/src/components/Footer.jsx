import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  LocalPhone,
  AutoStories,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#00474E",
        color: "white",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo y descripción */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              <AutoStories fontSize="large" sx={{ mr: 2 }} />
              Nodo Literario
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              Tu tienda de libros favorita. Encontrá los mejores títulos
              literarios con envíos a todo el país.
            </Typography>
          </Grid>

          {/* Enlaces */}
          <Grid sx={{ xs: 6, md: 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              Navegación
            </Typography>
            <Box
              component="nav"
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <MuiLink
                component={Link}
                to="/"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.light" } }}
              >
                Inicio
              </MuiLink>
              <MuiLink
                component={Link}
                to="/catalogo"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.light" } }}
              >
                Catálogo
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contacto"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.light" } }}
              >
                Contacto
              </MuiLink>
            </Box>
          </Grid>

          {/* Contacto */}
          <Grid sx={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              Contacto
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalPhone fontSize="small" />
                <Typography variant="body2">+54 11 1234-5678</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">info@nodo-literario.com</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Redes */}
          <Grid sx={{ xs: 12, md: 2 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              Redes Sociales
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                href="#"
                aria-label="Facebook"
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="#"
                aria-label="Instagram"
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="#"
                aria-label="Twitter"
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Línea y derechos */}
          <Grid sx={{ xs: 12 }}>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 3 }} />
            <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
              © 2025 - Nodo Literario. Todos los derechos
              reservados.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
