import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
  Container,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  Email,
  LocalPhone,
  LocationOn,
  Schedule,
  Security,
  Favorite,
  LocalShipping,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import LogoBlanco from "../assets/logo-nodo-literario-blanco.svg";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#00474E",
        background: `linear-gradient(135deg, #00474E 0%, #006D77 50%, #00474E 100%)`,
        color: "white",
        py: 6,
        mt: "auto",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, #83C5BE 0%, #FFDDD2 50%, #83C5BE 100%)`,
        },
      }}
    >
      {/* Elementos decorativos */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "5%",
          opacity: 0.1,
          transform: "rotate(12deg)",
        }}
      >
        <Box
          component="img"
          src={LogoBlanco}
          alt="Nodo Literario"
          sx={{
            height: 120,
            width: "auto",
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Logo y contacto - Más compacto */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                component="img"
                src={LogoBlanco}
                alt="Nodo Literario"
                sx={{
                  height: 40,
                  width: "auto",
                  mr: 2,
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #FFFFFF, #83C5BE)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    lineHeight: 1,
                  }}
                >
                  Nodo Literario
                </Typography>
                <Chip
                  label="Libros que inspiran"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    fontWeight: "medium",
                    height: 22,
                    mt: 0.5,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>
            </Box>

            {/* Contacto compacto */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocalPhone fontSize="small" sx={{ color: "#83C5BE" }} />
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  +54 11 1234-5678
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Email fontSize="small" sx={{ color: "#83C5BE" }} />
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  info@nodo-literario.com
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOn fontSize="small" sx={{ color: "#83C5BE" }} />
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  Buenos Aires, Argentina
                </Typography>
              </Box>
            </Box>

            {/* Características en línea */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Security
                  fontSize="small"
                  sx={{ color: "#83C5BE", fontSize: 16 }}
                />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Seguro
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocalShipping
                  fontSize="small"
                  sx={{ color: "#83C5BE", fontSize: 16 }}
                />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Rápido
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Schedule
                  fontSize="small"
                  sx={{ color: "#83C5BE", fontSize: 16 }}
                />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  24/48h
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Enlaces de navegación - Más compactos */}
          <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: "2px",
                  backgroundColor: "#83C5BE",
                  borderRadius: 2,
                },
              }}
            >
              Navegación
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5,
              }}
            >
              {[
                { label: "Inicio", path: "/" },
                { label: "Catálogo", path: "/catalogo" },
                { label: "Novedades", path: "/novedades" },
                { label: "Ofertas", path: "/ofertas" },
                { label: "Autores", path: "/autores" },
                { label: "Categorías", path: "/categorias" },
                { label: "Contacto", path: "/contacto" },
                { label: "Sobre Nosotros", path: "/nosotros" },
              ].map((item) => (
                <MuiLink
                  key={item.label}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  underline="none"
                  sx={{
                    opacity: 0.9,
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    py: 0.5,
                    "&:hover": {
                      opacity: 1,
                      color: "#83C5BE",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Redes sociales y acción principal */}
          <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: "2px",
                  backgroundColor: "#83C5BE",
                  borderRadius: 2,
                },
              }}
            >
              Síguenos
            </Typography>

            {/* Redes Sociales */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              {[
                { icon: <Facebook />, color: "#1877F2", label: "Facebook" },
                { icon: <Instagram />, color: "#E4405F", label: "Instagram" },
                { icon: <Twitter />, color: "#1DA1F2", label: "Twitter" },
                { icon: <Email />, color: "#83C5BE", label: "Email" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href="#"
                  aria-label={social.label}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: social.color,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${alpha(social.color, 0.4)}`,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>

            {/* Botón de contacto destacado */}
            <Button
              variant="contained"
              startIcon={<Email />}
              href="/contacto"
              component={Link}
              fullWidth
              sx={{
                backgroundColor: "#83C5BE",
                color: "#00474E",
                borderRadius: 2,
                py: 1.2,
                fontWeight: "bold",
                fontSize: "0.9rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(131, 197, 190, 0.3)",
                "&:hover": {
                  backgroundColor: "#FFDDD2",
                  color: "#00474E",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(131, 197, 190, 0.4)",
                },
              }}
            >
              Contáctanos
            </Button>

            {/* Horario de atención */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Schedule sx={{ color: "#83C5BE", fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                  Horario de atención
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ opacity: 0.8, lineHeight: 1.4 }}
              >
                Lunes a Viernes: 9:00 - 18:00 hs
                <br />
                Sábados: 9:00 - 13:00 hs
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Línea divisoria y derechos */}
        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.2)",
            my: 4,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Typography
            component="div"
            variant="body2"
            sx={{
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            © 2025 - Nodo Literario. Todos los derechos reservados.
            <Box
              component="span"
              sx={{
                display: { xs: "none", sm: "inline" },
                opacity: 0.6,
              }}
            >
              |
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#83C5BE",
              }}
            >
              Hecho con <Favorite sx={{ fontSize: 14 }} /> para lectores
            </Box>
          </Typography>

          {/* Enlaces legales */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink
              component={Link}
              to="/privacidad"
              color="inherit"
              underline="hover"
              sx={{
                opacity: 0.8,
                fontSize: "0.875rem",
                "&:hover": { opacity: 1, color: "#83C5BE" },
              }}
            >
              Privacidad
            </MuiLink>
            <MuiLink
              component={Link}
              to="/terminos"
              color="inherit"
              underline="hover"
              sx={{
                opacity: 0.8,
                fontSize: "0.875rem",
                "&:hover": { opacity: 1, color: "#83C5BE" },
              }}
            >
              Términos
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
