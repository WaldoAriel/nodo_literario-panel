import React from "react";
import { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  Container
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Imágenes representativas para cada categoría
  const categoriaImagenes = {
    "Ficción": "📚",
    "No Ficción": "📖", 
    "Infantil": "🧸",
    "Académico": "🎓",
    "Biografías": "👤",
    "Ciencia": "🔬",
    "Historia": "🏛️",
    "Arte": "🎨",
    "Cocina": "👨‍🍳",
    "Salud": "💊",
    "Deportes": "⚽",
    "Viajes": "✈️",
    "Misterio": "🕵️",
    "Romance": "💖",
    "Fantasía": "🐉",
    "Ciencia Ficción": "🚀",
    "Novela": "✍️",
    "Tragedia": "🎭",
    "Poesía": "❣️",
    "Ensayo": "🤔",
    "Cuento": "🏰"
    
  };

  // Colores para las tarjetas
  const colores = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

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
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column"
        }}
      >
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Cargando categorías...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "red", textAlign: "center", p: 4 }}>
        <Typography variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          color="primary"
        >
          Explora por Categorías
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          maxWidth="600px" 
          mx="auto"
        >
          Descubre libros organizados por tus temas favoritos. 
          Cada categoría es un mundo nuevo por explorar.
        </Typography>
      </Box>

      {/* Botón Todas las Categorías */}
      <Box textAlign="center" mb={4}>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/catalogo"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.3s ease'
          }}
        >
          📚 Ver Todos los Libros
        </Button>
      </Box>

      {/* Grid de Categorías */}
      <Grid container spacing={3}>
        {categorias.map((categoria, index) => {
          const imagen = categoriaImagenes[categoria.nombre] || "📖";
          const colorFondo = colores[index % colores.length];
          
          return (
            <Grid item xs={12} sm={6} md={4} key={categoria.id}>
              <Card 
                component={Link}
                to={`/catalogo/categoria/${categoria.id}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  borderRadius: 3,
                  background: colorFondo,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
                    '& .categoria-emoji': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }
                }}
              >
                <CardContent sx={{ 
                  textAlign: 'center', 
                  zIndex: 2,
                  position: 'relative'
                }}>
                  {/* Emoji/Ícono */}
                  <Typography 
                    className="categoria-emoji"
                    sx={{ 
                      fontSize: '4rem', 
                      mb: 2,
                      transition: 'transform 0.3s ease',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}
                  >
                    {imagen}
                  </Typography>
                  
                  {/* Nombre de la categoría */}
                  <Typography 
                    variant="h5" 
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {categoria.nombre}
                  </Typography>
                  
                  {/* Chip de explorar */}
                  <Chip
                    label="Explorar →"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  />
                </CardContent>
                
                {/* Efecto de overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                    zIndex: 1
                  }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer informativo */}
      <Box 
        textAlign="center" 
        mt={6} 
        p={3} 
        sx={{ 
          bgcolor: 'grey.50', 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          ¿No encontrás lo que buscás?
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Explora nuestro catálogo completo o contáctanos para ayudarte a encontrar el libro perfecto.
        </Typography>
        <Button 
          variant="contained" 
          component={Link}
          to="/catalogo"
          sx={{ mr: 2 }}
        >
          Catálogo Completo
        </Button>
        <Button 
          variant="outlined" 
          component={Link}
          to="/contacto"
        >
          Contactar
        </Button>
      </Box>
    </Container>
  );
}

export default Categorias;