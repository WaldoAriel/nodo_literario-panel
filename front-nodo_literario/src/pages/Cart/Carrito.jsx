import React from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  RemoveShoppingCart,
  ArrowBack
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Carrito() {
  const { 
    cart, 
    loading, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Función para obtener la imagen del libro - igual que en DetalleLibro
  const getImagenLibro = (libro) => {
    if (!libro) return null;
    
    // Si tiene imágenes relacionadas, tomar la primera
    if (libro.imagenes && libro.imagenes.length > 0) {
      return libro.imagenes[0].urlImagen;
    }
    
    return null;
  };

  const handleQuantityChange = async (idLibro, nuevaCantidad) => {
    const result = await updateQuantity(idLibro, nuevaCantidad);
    if (result.success) {
      setSnackbar({
        open: true,
        message: "Cantidad actualizada",
        severity: "success"
      });
    }
  };

  const handleRemoveItem = async (idLibro, titulo) => {
    const result = await removeFromCart(idLibro);
    if (result.success) {
      setSnackbar({
        open: true,
        message: `"${titulo}" eliminado del carrito`,
        severity: "info"
      });
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      setSnackbar({
        open: true,
        message: "Carrito vaciado",
        severity: "info"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Debug: ver la estructura de los items
  React.useEffect(() => {
    if (cart.items.length > 0) {
      console.log("📋 Estructura completa del carrito:", cart);
      console.log("🖼️ Primer libro con imágenes:", cart.items[0].libro);
    }
  }, [cart.items]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
            label={`${cart.cantidadTotal} ${cart.cantidadTotal === 1 ? 'item' : 'items'}`}
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      {cart.items.length === 0 ? (
        // Carrito vacío
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            px: 4,
            backgroundColor: 'grey.50'
          }}
        >
          <RemoveShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
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
        // Carrito con items
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Lista de Items */}
          <Box flex={1}>
            {cart.items.map((item) => (
              <Card key={item.id_libro} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* Imagen del libro - USANDO LA MISMA LÓGICA QUE DETALLELIBRO */}
                    <CardMedia
                      component="img"
                      image={getImagenLibro(item.libro) || '/placeholder-book.jpg'}
                      alt={item.libro?.titulo}
                      sx={{ 
                        width: 80, 
                        height: 120, 
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />

                    {/* Información del libro */}
                    <Box flex={1}>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {item.libro?.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        por {item.libro?.autores?.map(a => a.nombre).join(', ') || 'Autor desconocido'}
                      </Typography>
                      
                      {/* Precio unitario */}
                      <Typography variant="body1" color="primary.main" fontWeight="bold">
                        ${item.precio_unitario?.toLocaleString("es-AR")}
                      </Typography>
                    </Box>

                    {/* Controles de cantidad */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => handleQuantityChange(item.id_libro, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          minWidth: 40, 
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {item.cantidad}
                      </Typography>
                      
                      <IconButton
                        onClick={() => handleQuantityChange(item.id_libro, item.cantidad + 1)}
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
                        onClick={() => handleRemoveItem(item.id_libro, item.libro?.titulo)}
                        color="error"
                        size="small"
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
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

          {/* Resumen del Pedido */}
          <Box width={{ xs: '100%', md: 300 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
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
                <Typography variant="h6" fontWeight="bold">Total:</Typography>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Carrito;