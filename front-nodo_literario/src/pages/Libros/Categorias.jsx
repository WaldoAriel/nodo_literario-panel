import React from "react";
import { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categorias"
        );
        setCategorias(response.data.categorias || response.data);
      } catch (error) {
        console.error("Error al obtener las categorías", error);
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
        }}
      >
        <CircularProgress size={24} />
        <Typography sx={{ ml: 1 }}>Cargando las categorías...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "red", textAlign: "center", p: 2 }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Explorar por categoría
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {/* botón para todas las categorías */}
        <Button
          variant="contained"
          component={Link}
          to="/catalogo"
          sx={{ mr: 1, mb: 1 }}
        >
          Todas las categorías
        </Button>

        {/* los botones para cada categoría */}
        {categorias.map((categoria) => {
          return (
            <Button
              key={categoria.id}
              variant="contained"
              component={Link}
              to={`/catalogo/categoria/${categoria.id}`}
              sx={{ mr: 1, mb: 1 }}
            >
              {categoria.nombre}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}

export default Categorias;
