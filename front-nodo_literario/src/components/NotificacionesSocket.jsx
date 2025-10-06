import React, { useEffect, useState } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import io from 'socket.io-client';

const NotificacionesSocket = () => {
  const [notificacion, setNotificacion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('🔌 Conectando a Socket.IO...');
    
    // Conectar al servidor Socket.IO
    const socket = io('http://localhost:3000');

    // Escuchar evento de nuevo libro
    socket.on('nuevo-libro', (data) => {
      console.log('📢 Nueva notificación recibida:', data);
      setNotificacion(data);
      setOpen(true);
    });

    // Confirmar conexión
    socket.on('connect', () => {
      console.log('✅ Conectado al servidor Socket.IO');
    });

    // Manejar errores de conexión
    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
    });

    // Limpiar conexión al desmontar
    return () => {
      console.log('🔌 Desconectando Socket.IO...');
      socket.disconnect();
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleVerLibro = () => {
    if (notificacion) {
      // Navegar a la página del libro
      window.location.href = `/libros/${notificacion.id}`;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ 
        mt: 6,
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity="info"
        sx={{ 
          width: '100%', 
          maxWidth: 350,
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
        icon={false}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={notificacion?.imagen}
            sx={{ width: 50, height: 50 }}
            variant="rounded"
          >
            📚
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              🎉 ¡Nuevo Libro!
            </Typography>
            
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              "{notificacion?.titulo}"
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              por {notificacion?.autores?.[0]?.nombre || 'Autor desconocido'}
            </Typography>
            
            <Typography variant="h6" color="success.main" gutterBottom>
              ${notificacion?.precio}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button 
                variant="contained" 
                size="small"
                onClick={handleVerLibro}
              >
                Ver Libro
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificacionesSocket;