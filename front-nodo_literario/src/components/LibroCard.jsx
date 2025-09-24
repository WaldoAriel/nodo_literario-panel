import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Chip,
  Box,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";

function LibroCard({ 
  id,
  titulo,
  autor,
  imagen,
  precio = 0,
  stock = 0,
  oferta,
  descuento = 0,
}) {
  const precioFinal = oferta ? precio * (1 - descuento / 100) : precio;
  return (
    <Card
      sx={{
        maxWidth: 250,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        position: "relative",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: 6,
        },
      }}
    >
      {oferta && (
        <Chip
          label={`OFERTÓN! ${descuento}% OFF`}
          icon={<LocalOfferIcon sx={{ fontSize: "1.1rem" }} />}
          color="secondary"
          size="small"
          sx={{
            position: "absolute",
            top: 140,
            left: 10,
            zIndex: 2,
            backgroundColor: "rgba(255, 87, 34, 0.7)",
            color: "white",
            fontWeight: "bold",
            paddingRight: 0.5,
            transform: "rotate(-30deg)",
            transformOrigin: "bottom left",
            borderRadius: "5",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {/* stock */}
      {stock <= 8 && (
        <Chip
          label={stock === 0 ? "AGOTADO" : `Últimas ${stock} unidades`}
          color={stock === 0 ? "error" : "warning"}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor:
              stock === 0 ? "rgba(244, 67, 54, 0.7)" : "rgba(255, 152, 0, 0.7)",
          }}
        />
      )}

      {/* Contenedor para la imagen del prod */} 
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 240,
          backgroundColor: "#eee",
          p: 1,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={imagen}
          alt={`Portada de ${titulo}`}
          sx={{
            borderRadius: 2,
            maxHeight: "100%",
            maxWidth: "100%",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "64px",
            textAlign: "left",
          }}
        >
          {titulo}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, textAlign: "left" }}
        >
          {autor}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {oferta && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "text.disabled",
                mr: 1,
              }}
            >
              ${precio.toLocaleString("es-AR")}
            </Typography>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            ${precioFinal.toLocaleString("es-AR")}
          </Typography>

          {precio > 17000 && (
            <Chip label="ENVÍO GRATIS" color="success" size="small" />
          )}
        </Box>

        <Button
          variant="contained"
          fullWidth
          disabled={stock === 0} //desabilita si no hay stock
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
            "&:disabled": { opacity: 0.6 },
          }}
          component={Link}
          to={`/libro/${id}`}
        >
          {stock === 0 ? "SIN STOCK" : "Más detalles"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default LibroCard;
