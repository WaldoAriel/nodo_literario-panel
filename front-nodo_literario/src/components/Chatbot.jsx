// front-nodo_literario/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { chatbotService } from '../services/chatbotService';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [mensajeInput, setMensajeInput] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (open && mensajes.length === 0) {
      setMensajes([{
        id: 1,
        contenido: "¡Hola! Soy tu asistente de Nodo Literario. ¿En qué puedo ayudarte hoy? Puedo responder tus preguntas sobre libros, categorías y nuestros servicios.",
        tipo: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [open, mensajes.length]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensajeInput.trim() || cargando) return;

    const mensajeTexto = mensajeInput.trim();
    
    // Agregar mensaje del usuario
    const mensajeUsuario = {
      id: Date.now(),
      contenido: mensajeTexto,
      tipo: 'usuario',
      timestamp: new Date()
    };
    
    setMensajes(prev => [...prev, mensajeUsuario]);
    setMensajeInput('');
    setCargando(true);

    try {
      const resultado = await chatbotService.enviarMensaje(mensajeTexto);
      
      const mensajeBot = {
        id: Date.now() + 1,
        contenido: resultado.respuesta,
        tipo: 'bot',
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, mensajeBot]);
    } catch (error) {
      console.error('Error:', error);
      
      const mensajeError = {
        id: Date.now() + 1,
        contenido: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
        tipo: 'bot',
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {/* Botón flotante */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Diálogo del Chatbot */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '70vh',
            maxHeight: '600px',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Box>
              <Typography variant="h6" component="div">
                Nodo Literario
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Asistente virtual
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Área de mensajes */}
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {mensajes.map((mensaje) => (
              <Box
                key={mensaje.id}
                sx={{
                  display: 'flex',
                  justifyContent: mensaje.tipo === 'usuario' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                {mensaje.tipo === 'bot' && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.light'
                    }}
                  >
                    <BotIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: mensaje.tipo === 'usuario' ? 'primary.main' : 'grey.100',
                    color: mensaje.tipo === 'usuario' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    borderTopLeftRadius: mensaje.tipo === 'bot' ? 4 : 16,
                    borderTopRightRadius: mensaje.tipo === 'usuario' ? 4 : 16
                  }}
                >
                  <Typography variant="body2">
                    {mensaje.contenido}
                  </Typography>
                </Paper>
                {mensaje.tipo === 'usuario' && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'secondary.main'
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))}
            
            {cargando && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.light'
                  }}
                >
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    borderTopLeftRadius: 4
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Escribiendo...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            component="form"
            onSubmit={enviarMensaje}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={mensajeInput}
                onChange={(e) => setMensajeInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={cargando}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <IconButton
                type="submit"
                disabled={cargando || !mensajeInput.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.400'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;