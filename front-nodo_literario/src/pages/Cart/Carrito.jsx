import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  Chip,
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  RemoveShoppingCart,
  ArrowBack,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// =============================================
// 1. AGREGAR ESTE NUEVO COMPONENTE ANTES DE "Carrito"
// =============================================
const CartItem = React.memo(({ item, onQuantityChange, onRemove }) => {
    console.log(`🔄 CartItem ${item.id_libro} se está renderizando`);

  // Función para obtener la imagen del libro
  const getImagenLibro = (libro) => {
    if (!libro) return null;
    if (libro.imagenes && libro.imagenes.length > 0) {
      return libro.imagenes[0].urlImagen;
    }
    return null;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Imagen del libro */}
          <CardMedia
            component="img"
            image={getImagenLibro(item.libro) || "/placeholder-book.jpg"}
            alt={item.libro?.titulo}
            sx={{
              width: 80,
              height: 120,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />

          {/* Información del libro */}
          <Box flex={1}>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {item.libro?.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              por{" "}
              {item.libro?.autores?.map((a) => a.nombre).join(", ") ||
                "Autor desconocido"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Stock disponible: {item.libro?.stock || 0}
            </Typography>

            {/* Precio unitario */}
            <Typography variant="body1" color="primary.main" fontWeight="bold">
              ${item.precio_unitario?.toLocaleString("es-AR")}
            </Typography>
          </Box>

          {/* Controles de cantidad */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={() => onQuantityChange(item.id_libro, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              size="small"
            >
              <Remove />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                minWidth: 40,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {item.cantidad}
            </Typography>

            <IconButton
              onClick={() => onQuantityChange(item.id_libro, item.cantidad + 1)}
              disabled={item.cantidad >= (item.libro?.stock || 0)}
              size="small"
            >
              <Add />
            </IconButton>
          </Box>

          {/* Subtotal y eliminar */}
          <Box textAlign="right" minWidth={120}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ${item.subtotal?.toLocaleString("es-AR")}
            </Typography>
            <Button
              startIcon={<Delete />}
              onClick={() => onRemove(item.id_libro, item.libro?.titulo)}
              color="error"
              size="small"
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

// =============================================
// 2. TU COMPONENTE Carrito ORIGINAL (CON MODIFICACIONES)
// =============================================
function Carrito() {
  console.log("🔄 Componente Carrito se está renderizando");

  const { cart, loading, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

// DEBUG: Ver qué cambia entre renders
  React.useEffect(() => {
    console.log("📊 Estado del carrito actualizado:", {
      itemsCount: cart.items.length,
      total: cart.total,
      cantidadTotal: cart.cantidadTotal
    });
  }, [cart]);

  // =============================================
  // 3. REEMPLAZAR LAS FUNCIONES handleQuantityChange y handleRemoveItem
  // =============================================
  const handleQuantityChange = React.useCallback(
    async (idLibro, nuevaCantidad) => {
      const result = await updateQuantity(idLibro, nuevaCantidad);

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Cantidad actualizada",
          severity: "success",
        });
      } else if (result.error?.includes("Stock insuficiente")) {
        setSnackbar({
          open: true,
          message: `${result.error}. Stock máximo: ${result.stockDisponible}`,
          severity: "warning",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Error al actualizar cantidad",
          severity: "error",
        });
      }
    },
    [updateQuantity]
  );

  const handleRemoveItem = React.useCallback(
    async (idLibro, titulo) => {
      const result = await removeFromCart(idLibro);
      if (result.success) {
        setSnackbar({
          open: true,
          message: `"${titulo}" eliminado del carrito`,
          severity: "info",
        });
      }
    },
    [removeFromCart]
  );

  // =============================================
  // 4. EL RESTO DE TUS FUNCIONES PERMANECEN IGUAL
  // =============================================
  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      setSnackbar({
        open: true,
        message: "Carrito vaciado",
        severity: "info",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header - TODO ESTO PERMANECE IGUAL */}
      <Box display="flex" alignItems="center" mb={4}>
        <Button
          component={Link}
          to="/catalogo"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Seguir Comprando
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tu Carrito de Compras
        </Typography>
        {cart.items.length > 0 && (
          <Chip
            label={`${cart.cantidadTotal} ${
              cart.cantidadTotal === 1 ? "item" : "items"
            }`}
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      {cart.items.length === 0 ? (
        // Carrito vacío - TODO ESTO PERMANECE IGUAL
        <Paper
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            backgroundColor: "grey.50",
          }}
        >
          <RemoveShoppingCart sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" color="grey.600" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography variant="body1" color="grey.500" paragraph>
            ¡Descubre nuestros libros y agrega algunos a tu carrito!
          </Typography>
          <Button
            component={Link}
            to="/catalogo"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Explorar Catálogo
          </Button>
        </Paper>
      ) : (
        // =============================================
        // 5. MODIFICAR SOLO ESTA PARTE - USAR CartItem EN LUGAR DEL CÓDIGO ORIGINAL
        // =============================================
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          {/* Lista de Items - REEMPLAZADO CON COMPONENTE OPTIMIZADO */}
          <Box flex={1}>
            {cart.items.map((item) => (
              <CartItem
                key={item.id_libro}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}

            {/* Botón Vaciar Carrito */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                startIcon={<RemoveShoppingCart />}
                onClick={handleClearCart}
                variant="outlined"
                color="error"
              >
                Vaciar Carrito
              </Button>
            </Box>
          </Box>

          {/* Resumen del Pedido - TODO ESTO PERMANECE IGUAL */}
          <Box width={{ xs: "100%", md: 300 }}>
            <Paper sx={{ p: 3, position: "sticky", top: 100 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Resumen del Pedido
              </Typography>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  ${cart.total?.toLocaleString("es-AR")}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Envío:</Typography>
                <Typography variant="body2" color="success.main">
                  GRATIS
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  ${cart.total?.toLocaleString("es-AR")}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                component={Link}
                to="/checkout"
                sx={{ mb: 2 }}
              >
                Proceder al Pago
              </Button>

              <Button
                component={Link}
                to="/catalogo"
                variant="outlined"
                fullWidth
              >
                Seguir Comprando
              </Button>
            </Paper>
          </Box>
        </Box>
      )}

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
    </Container>
  );
}

export default Carrito;
