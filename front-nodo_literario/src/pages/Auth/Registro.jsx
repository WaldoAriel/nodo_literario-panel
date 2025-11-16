import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    tipo_cliente: 'regular'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        navigate('/'); // Redirigir al home después del registro exitoso
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Icono o logo */}
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Typography variant="h5" color="white" fontWeight="bold">
              NL
            </Typography>
          </Box>

          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Crear Cuenta
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Únete a la comunidad de Nodo Literario
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="given-name"
                value={formData.nombre}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
                autoComplete="family-name"
                value={formData.apellido}
                onChange={handleChange}
                disabled={loading}
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              fullWidth
              id="telefono"
              label="Teléfono"
              name="telefono"
              autoComplete="tel"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-cliente-label">Tipo de Cliente</InputLabel>
              <Select
                labelId="tipo-cliente-label"
                id="tipo_cliente"
                name="tipo_cliente"
                value={formData.tipo_cliente}
                label="Tipo de Cliente"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              helperText="Mínimo 6 caracteres"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Crear Cuenta'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                sx={{ color: 'primary.main' }}
              >
                ¿Ya tienes una cuenta? Inicia sesión aquí
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}