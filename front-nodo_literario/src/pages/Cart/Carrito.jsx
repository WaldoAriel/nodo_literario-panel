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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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

const CartItem = React.memo(({ item, onQuantityChange, onRemove }) => {
  const getImagenLibro = (libro) => {
    if (!libro) return null;
    if (libro.imagenes && libro.imagenes.length > 0) {
      return libro.imagenes[0].urlImagen;
    }
    return null;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Layout para desktop/tablet */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ display: { xs: "none", sm: "flex" } }} // ← Oculta en móvil
        >
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

            <Typography variant="body1" color="primary.main" fontWeight="bold">
              ${item.precio_unitario?.toLocaleString("es-AR")}
            </Typography>
          </Box>

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

        {/* Layout para celus */}
        <Box
          sx={{ display: { xs: "block", sm: "none" } }} // ← Solo en celulares
        >
          {/* Fila 1: Imagen + Info básica */}
          <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
            <CardMedia
              component="img"
              image={getImagenLibro(item.libro) || "/placeholder-book.jpg"}
              alt={item.libro?.titulo}
              sx={{
                width: 60,
                height: 90,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />

            <Box flex={1}>
              <Typography
                variant="h6"
                component="h3"
                fontWeight="bold"
                fontSize="1rem"
              >
                {item.libro?.titulo}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="0.8rem"
              >
                por{" "}
                {item.libro?.autores?.map((a) => a.nombre).join(", ") ||
                  "Autor desconocido"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.75rem"
              >
                Stock: {item.libro?.stock || 0}
              </Typography>
            </Box>
          </Box>

          {/* Fila 2: Precio unitario + Controles cantidad */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="body1"
              color="primary.main"
              fontWeight="bold"
              fontSize="0.9rem"
            >
              ${item.precio_unitario?.toLocaleString("es-AR")} c/u
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() =>
                  onQuantityChange(item.id_libro, item.cantidad - 1)
                }
                disabled={item.cantidad <= 1}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Remove fontSize="small" />
              </IconButton>

              <Typography
                variant="h6"
                sx={{
                  minWidth: 30,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {item.cantidad}
              </Typography>

              <IconButton
                onClick={() =>
                  onQuantityChange(item.id_libro, item.cantidad + 1)
                }
                disabled={item.cantidad >= (item.libro?.stock || 0)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Fila 3: Subtotal + Eliminar */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" fontSize="0.9rem">
              Total: ${item.subtotal?.toLocaleString("es-AR")}
            </Typography>

            <Button
              startIcon={<Delete />}
              onClick={() => onRemove(item.id_libro, item.libro?.titulo)}
              color="error"
              size="small"
              sx={{ minWidth: "auto", px: 1 }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

function Carrito() {
  const { cart, loading, removeFromCart, updateQuantity, clearCart } =
    useCart();

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialog, setDeleteDialog] = React.useState({
    open: false,
    itemId: null,
    itemTitle: "",
  });

  const [clearCartDialog, setClearCartDialog] = React.useState({
    open: false,
  });

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

  const handleRemoveClick = (idLibro, titulo) => {
    setDeleteDialog({
      open: true,
      itemId: idLibro,
      itemTitle: titulo,
    });
  };

  const handleConfirmDelete = async () => {
    const { itemId, itemTitle } = deleteDialog;
    const result = await removeFromCart(itemId);

    if (result.success) {
      setSnackbar({
        open: true,
        message: `"${itemTitle}" eliminado del carrito`,
        severity: "info",
      });
    }

    setDeleteDialog({ open: false, itemId: null, itemTitle: "" });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, itemId: null, itemTitle: "" });
  };

  const handleClearCartClick = () => {
    setClearCartDialog({ open: true });
  };

  const handleConfirmClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      setSnackbar({
        open: true,
        message: "Carrito vaciado",
        severity: "info",
      });
    }
    setClearCartDialog({ open: false });
  };

  const handleCancelClearCart = () => {
    setClearCartDialog({ open: false });
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
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
          <Box flex={1}>
            {cart.items.map((item) => (
              <CartItem
                key={item.id_libro}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveClick}
              />
            ))}

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                startIcon={<RemoveShoppingCart />}
                onClick={handleClearCartClick}
                variant="outlined"
                color="error"
              >
                Vaciar Carrito
              </Button>
            </Box>
          </Box>

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

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Eliminar producto del carrito?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar "{deleteDialog.itemTitle}" de
            tu carrito de compras?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={clearCartDialog.open}
        onClose={handleCancelClearCart}
        aria-labelledby="clear-cart-dialog-title"
        aria-describedby="clear-cart-dialog-description"
      >
        <DialogTitle id="clear-cart-dialog-title">
          ¿Vaciar carrito de compras?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-cart-dialog-description">
            ¿Estás seguro de que deseas eliminar todos los productos de tu
            carrito? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClearCart} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmClearCart} color="error" autoFocus>
            Sí, Vaciar Carrito
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
