import React, { useState } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Datos de envío', 'Método de pago', 'Confirmación'];

// Métodos de pago simulados
const paymentMethods = [
  {
    id: 'mercadopago',
    name: 'MercadoPago',
    description: 'Paga con tu cuenta de MercadoPago',
    logo: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga con tu cuenta de PayPal',
    logo: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg'
  },
  {
    id: 'creditcard',
    name: 'Tarjeta de Crédito',
    description: 'Paga con tarjeta de crédito o débito',
    logo: 'https://cdn-icons-png.flaticon.com/512/179/179430.png'
  }
];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [errors, setErrors] = useState({});

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Validación del formulario de envío
  const validateShippingForm = () => {
    const newErrors = {};
    if (!shippingData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!shippingData.apellido) newErrors.apellido = 'Apellido es requerido';
    if (!shippingData.direccion) newErrors.direccion = 'Dirección es requerida';
    if (!shippingData.ciudad) newErrors.ciudad = 'Ciudad es requerida';
    if (!shippingData.codigoPostal) newErrors.codigoPostal = 'Código postal es requerido';
    if (!shippingData.telefono) newErrors.telefono = 'Teléfono es requerido';
    if (!shippingData.email) newErrors.email = 'Email es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simulación de procesamiento de pago
  const processPayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular éxito/fracaso aleatorio (90% éxito)
        const success = Math.random() > 0.1;
        resolve(success);
      }, 3000);
    });
  };

  // Simulación de creación de pedido
  const createOrder = async () => {
    const orderNum = 'ORD-' + Date.now();
    setOrderNumber(orderNum);
    
    // Simular guardado en base de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Limpiar carrito después de orden exitosa
    await clearCart();
    
    return orderNum;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!validateShippingForm()) return;
    }
    
    if (activeStep === 1) {
      if (!paymentMethod) {
        setErrors({ ...errors, paymentMethod: 'Selecciona un método de pago' });
        return;
      }
      
      setLoading(true);
      
      try {
        // Simular procesamiento de pago
        const paymentSuccess = await processPayment();
        
        if (paymentSuccess) {
          // Crear orden
          await createOrder();
          setActiveStep(activeStep + 1);
        } else {
          setErrors({ ...errors, payment: 'El pago fue rechazado. Intenta con otro método.' });
        }
      } catch (error) {
        setErrors({ ...errors, payment: 'Error procesando el pago. Intenta nuevamente.' });
      } finally {
        setLoading(false);
      }
      
      return;
    }
    
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleShippingChange = (field) => (event) => {
    setShippingData({
      ...shippingData,
      [field]: event.target.value
    });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Paso 1: Datos de envío
  const renderShippingStep = () => (
    <Box component="form" noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Nombre"
            value={shippingData.nombre}
            onChange={handleShippingChange('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Apellido"
            value={shippingData.apellido}
            onChange={handleShippingChange('apellido')}
            error={!!errors.apellido}
            helperText={errors.apellido}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Dirección"
            value={shippingData.direccion}
            onChange={handleShippingChange('direccion')}
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Ciudad"
            value={shippingData.ciudad}
            onChange={handleShippingChange('ciudad')}
            error={!!errors.ciudad}
            helperText={errors.ciudad}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Código Postal"
            value={shippingData.codigoPostal}
            onChange={handleShippingChange('codigoPostal')}
            error={!!errors.codigoPostal}
            helperText={errors.codigoPostal}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Teléfono"
            value={shippingData.telefono}
            onChange={handleShippingChange('telefono')}
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            value={shippingData.email}
            onChange={handleShippingChange('email')}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Paso 2: Método de pago
  const renderPaymentStep = () => (
    <Box sx={{ mt: 2 }}>
      {errors.payment && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.payment}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {paymentMethods.map((method) => (
          <Grid item xs={12} key={method.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: paymentMethod === method.id ? 2 : 1,
                borderColor: paymentMethod === method.id ? 'primary.main' : 'grey.300'
              }}
              onClick={() => {
                setPaymentMethod(method.id);
                setErrors({ ...errors, paymentMethod: '' });
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <img 
                    src={method.logo} 
                    alt={method.name}
                    style={{ width: 60, height: 40, objectFit: 'contain' }}
                  />
                  <Box>
                    <Typography variant="h6">{method.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {errors.paymentMethod && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errors.paymentMethod}
        </Typography>
      )}
    </Box>
  );

  // Paso 3: Confirmación
  const renderConfirmationStep = () => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="h6">
          ¡Pedido realizado exitosamente!
        </Typography>
      </Alert>
      
      <Typography variant="h5" gutterBottom color="primary">
        Número de pedido: {orderNumber}
      </Typography>
      
      <Typography variant="body1" paragraph>
        Hemos enviado un correo de confirmación a <strong>{shippingData.email}</strong>
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        Tu pedido será procesado y enviado en un plazo de 2-3 días hábiles.
      </Typography>
    </Box>
  );

  // Resumen del pedido (sidebar)
  const renderOrderSummary = () => (
    <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
      <Typography variant="h6" gutterBottom>
        Resumen del Pedido
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        {cart.items.map((item) => (
          <Box key={item.id_libro} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              {item.libro?.titulo} x {item.cantidad}
            </Typography>
            <Typography variant="body2">
              ${item.subtotal?.toLocaleString('es-AR')}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal:</Typography>
        <Typography>${cart.total?.toLocaleString('es-AR')}</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Envío:</Typography>
        <Typography color="success.main">GRATIS</Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary.main">
          ${cart.total?.toLocaleString('es-AR')}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Finalizar Compra
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {activeStep === 0 && renderShippingStep()}
            {activeStep === 1 && renderPaymentStep()}
            {activeStep === 2 && renderConfirmationStep()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={activeStep === 0 ? () => navigate('/carrito') : handleBack}
                disabled={loading}
              >
                {activeStep === 0 ? 'Volver al Carrito' : 'Atrás'}
              </Button>
              
              {activeStep < steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  endIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Procesando...' : activeStep === 1 ? 'Pagar Ahora' : 'Continuar'}
                </Button>
              )}
              
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                >
                  Volver al Inicio
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {renderOrderSummary()}
        </Grid>
      </Grid>
    </Container>
  );
}