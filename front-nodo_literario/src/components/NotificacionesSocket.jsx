import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import io from "socket.io-client";

const NotificacionesSocket = () => {
  const [notificacion, setNotificacion] = useState(null);
  const [open, setOpen] = useState(false);

  // Función para reproducir "pop"
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/sounds/cortazar.mp3");
      audio.volume = 0.4;
      audio.play().catch(error => {
        // Error silencioso - algunos navegadores bloquean autoplay
      });
    } catch (error) {
      // Error silencioso - audio no disponible
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("nuevo-libro", (data) => {
      setNotificacion(data);
      setOpen(true);
      playNotificationSound();
    });

    socket.on("connect_error", (error) => {
      console.log("Error de conexión Socket.IO:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleVerLibro = () => {
    if (notificacion) {
      window.open(`/libro/${notificacion.id}`, "_blank");
    }
    setOpen(false);
  };

  const autor = notificacion?.autores?.[0];
  const nombreCompletoAutor = autor
    ? `${autor.nombre || ""} ${autor.apellido || ""}`.trim() || "Autor desconocido"
    : "Autor desconocido";

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        mt: 6,
        "& .MuiSnackbar-root": {
          pointerEvents: "all",
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{
          width: "100%",
          maxWidth: 350,
          backgroundColor: "background.paper",
          boxShadow: 3,
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
        icon={false}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            src={notificacion?.imagen}
            sx={{
              width: 50,
              height: 50,
              bgcolor: "primary.light",
            }}
            variant="rounded"
          >
            📚
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontSize: "1.1rem" }}
            >
              🎉 ¡Nuevo Libro!
            </Typography>
            
            <Typography
              variant="body1"
              fontWeight="bold"
              gutterBottom
              sx={{
                wordBreak: "break-word",
                lineHeight: 1.2,
              }}
            >
              "{notificacion?.titulo}"
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              por {nombreCompletoAutor}
            </Typography>
            
            <Typography variant="h6" color="success.main" gutterBottom>
              ${notificacion?.precio}
            </Typography>
            
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleVerLibro}
                sx={{ flex: 1 }}
              >
                Ver Libro
              </Button>
              <Button variant="outlined" size="small" onClick={handleClose}>
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