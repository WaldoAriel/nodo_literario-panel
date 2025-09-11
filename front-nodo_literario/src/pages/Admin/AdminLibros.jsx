import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React from "react";

function AdminLibros() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/libros"
        );
        setLibros(response.data);
      } catch (error) {
        console.error("Error al cargar los libros", error);
        alert("No se pudieron cargar los libros");
      } finally {
        setLoading(false);
      }
    };
    fetchLibros();
  }, []);
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Cargando Libros...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{p:5}}>
      <Typography variant="h4" gutterBottom>
        🛠️ Panel Administrador - Libros
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert("Botón de crear (Proximamente)")}
        sx={{ mb: 3 }}
      >
        + Nuevo Libro
      </Button>
      <Box>
        {libros.length === 0 ? (
          <Typography>No hay libros cargados.</Typography>
        ) : (
          libros.map((libro) => (
            <Box
              key={libro.id}
              sx={{
                p: 2,
                mb: 2,
                border: "1px, solid #ccc",
                borderRadius: 1,
                backgroundColor: "f9f9f9",
              }}
            >
              <Typography variant="h6">{libro.titulo}</Typography>
              <Typography color="text.secondary">
                ${libro.precio} - Stock ${libro.stock}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => alert(`Editar ${libro.titulo}`)}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => alert(`Eliminar ${libro.titulo}`)}
              >
                Eliminar
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

export default AdminLibros;
