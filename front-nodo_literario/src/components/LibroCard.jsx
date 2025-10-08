import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ShoppingCart, AddShoppingCart } from "@mui/icons-material";
import {
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
  Chip,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { addToCart, isInCart, loading } = useCart();
  const precioFinal = oferta ? precio * (1 - descuento / 100) : precio;

  const handleAddToCart = async () => {
    if (stock === 0) return;

    const libro = {
      id,
      titulo,
      imagen,
      precio: precioFinal,
      stock,
    };

    const result = await addToCart(libro, 1);

    if (result.success) {
      setSnackbar({
        open: true,
        message: `"${titulo}" agregado al carrito`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || "Error al agregar al carrito",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const enCarrito = isInCart(id);

  return (
    <>
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
                stock === 0
                  ? "rgba(244, 67, 54, 0.7)"
                  : "rgba(255, 152, 0, 0.7)",
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
            position: "relative",
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

          {/* Botón rápido de carrito superpuesto */}
          {stock > 0 && (
            <IconButton
              onClick={handleAddToCart}
              disabled={loading || enCarrito}
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "&:disabled": {
                  backgroundColor: enCarrito ? "success.main" : "grey.400",
                },
              }}
              size="small"
            >
              {enCarrito ? <ShoppingCart /> : <AddShoppingCart />}
            </IconButton>
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
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
          </Box>

          <Box>
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
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={enCarrito ? "outlined" : "contained"}
                fullWidth
                onClick={handleAddToCart}
                disabled={stock === 0 || loading}
                startIcon={enCarrito ? <ShoppingCart /> : <AddShoppingCart />}
                sx={{
                  backgroundColor: enCarrito ? "transparent" : "primary.main",
                  color: enCarrito ? "primary.main" : "white",
                  borderColor: enCarrito ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor: enCarrito
                      ? "primary.light"
                      : "primary.dark",
                    color: enCarrito ? "white" : "white",
                  },
                }}
              >
                {stock === 0
                  ? "SIN STOCK"
                  : enCarrito
                  ? "EN CARRITO"
                  : "AGREGAR"}
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to={`/libro/${id}`}
                sx={{
                  minWidth: "auto",
                  px: 2,
                }}
              >
                👁️‍🗨️
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LibroCard;
