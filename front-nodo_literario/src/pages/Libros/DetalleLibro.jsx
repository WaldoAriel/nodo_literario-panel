import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  CardMedia,
  Chip,
} from "@mui/material";
import axios from "axios";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

function DetalleLibro() {
  const { id } = useParams();
  const [libro, setLibro] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url; // Ya es URL absoluta
    return `http://localhost:3000${url}`; // Convertir relativa a absoluta
  };

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:3000/api/libros/${id}`
        );

        setLibro(response.data);

        // Establecer la primera imagen como principal
        if (response.data.imagenes && response.data.imagenes.length > 0) {
          setImagenPrincipal(response.data.imagenes[0].urlImagen);
        }
      } catch (error) {
        console.error("Error al obtener el libro", error);
        if (error.response && error.response.status === 404) {
          setError(`Libro no encontrado.`);
        } else {
          setError(`Error al cargar el libro. Intenta nuevamente más tarde.`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLibro();
    }
  }, [id]);

  const cambiarImagen = (nuevaImagen) => {
    setImagenPrincipal(nuevaImagen);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando libro...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verifica la conexión, pasaron cosas...
        </Typography>
      </Box>
    );
  }

  if (!libro) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5">Libro no disponible.</Typography>
        <Typography variant="body1">
          El libro solicitado no pudo ser cargado
        </Typography>
      </Box>
    );
  }

  const precioOriginal = parseFloat(libro.precio);
  const precioConDescuento = libro.oferta
    ? precioOriginal * (1 - (libro.descuento || 0) / 100)
    : precioOriginal;

  return (
    <Box sx={{ p: 4 }}>
      {/* Encabezado con título */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ mb: 4, textAlign: "center" }}
      >
        {libro.titulo}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* Sección de imágenes */}
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Imagen principal */}
          <CardMedia
            component="img"
            image={getImageUrl(
              imagenPrincipal ||
                (libro.imagenes && libro.imagenes[0]?.urlImagen)
            )}
            alt={`Portada de ${libro.titulo}`}
            sx={{
              borderRadius: 2,
              width: "100%",
              maxWidth: "400px",
              maxHeight: "500px",
              objectFit: "contain",
              mb: 3,
              boxShadow: 3,
            }}
          />

          {/* Galería de miniaturas */}
          {libro.imagenes && libro.imagenes.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
                mt: 2,
              }}
            >
              {libro.imagenesproducto.map((imagen, index) => (
                <Box
                  key={imagen.id}
                  component="img"
                  src={imagen.urlImagen}
                  alt={`Vista ${index + 1} de ${libro.titulo}`}
                  onClick={() => cambiarImagen(getImageUrl(imagen.urlImagen))}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                    border:
                      imagenPrincipal === imagen.urlImagen
                        ? "3px solid primary.main"
                        : "2px solid grey.300",
                    opacity: imagenPrincipal === imagen.urlImagen ? 1 : 0.7,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 1,
                      border: "3px solid primary.main",
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Sección de detalles del libro */}
        <Box
          sx={{
            flexGrow: 1,
            textAlign: { xs: "center", md: "left" },
            maxWidth: { md: "50%" },
          }}
        >
          {/* Autor */}
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {libro.autores && libro.autores.length > 0
              ? `Por ${libro.autores[0].nombre} ${libro.autores[0].apellido}`
              : "Autor desconocido"}
          </Typography>

          {/* Categoría y Editorial */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Chip
              label={libro.categoria?.nombre || "Sin categoría"}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={libro.editorial?.nombre || "Sin editorial"}
              color="secondary"
              variant="outlined"
            />
          </Box>

          {/* Descripción */}
          <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
            {libro.descripcion || "Descripción no disponible."}
          </Typography>

          {/* Precio */}
          <Box sx={{ mb: 3 }}>
            {libro.oferta && (
              <>
                <Typography variant="h6" color="text.disabled" gutterBottom>
                  Precio Original:
                </Typography>
                <Typography
                  variant="h6"
                  color="text.disabled"
                  sx={{ textDecoration: "line-through", mb: 1 }}
                >
                  ${precioOriginal.toLocaleString("es-AR")}
                </Typography>
                <Chip
                  icon={<LocalOfferIcon />}
                  label={`${libro.descuento}% OFF`}
                  color="secondary"
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ${precioConDescuento.toLocaleString("es-AR")}
            </Typography>
          </Box>

          {/* Stock y botón de compra */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: libro.stock > 0 ? "success.main" : "error.main",
                fontWeight: "bold",
              }}
            >
              {libro.stock > 0
                ? `✓ Stock disponible: ${libro.stock} unidades`
                : "✗ Sin stock"}
            </Typography>

            <Button
              variant="contained"
              size="large"
              disabled={libro.stock === 0}
              sx={{
                minWidth: "200px",
                fontSize: "1.1rem",
                py: 1.5,
              }}
            >
              {libro.stock > 0 ? "Añadir al carrito" : "SIN STOCK"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DetalleLibro;
