import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  CardMedia,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import axios from "axios";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

function DetalleLibro() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensajeTexto, setNuevoMensajeTexto] = useState("");
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [errorMensajes, setErrorMensajes] = useState(null);


  useEffect(() => {
    const fetchLibro = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:3000/api/libros/${id}`
        );

        setLibro(response.data);
      } catch (error) {
        console.error("Error al obtener el libro", error);
        if (error.response && error.response.status === 404) {
          setError(`Libro no encontrado.`);
        } else {
          setError(
            `Error al cargar el libro. Intenta nuevamente más tarde.`
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchLibro();
    }
  }, [id]);

  const fetchMensajes = async () => {
    setLoadingMensajes(true);
    setErrorMensajes(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/libros/${id}/mensajes`
      )
      setMensajes(response.data)
    } catch (error) {
      console.error('Error al obtener el mensaje', error)
      setMensajes([])
    } finally{
      setLoadingMensajes(false)
    }
  };
  useEffect(()=>{
    if(id){
      fetchMensajes()
    }
  }, [id])

  
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

  const precioOriginal = libro.precio;
  const precioConDescuento = libro.oferta
    ? precioOriginal * (1 - libro.descuento / 100)
    : precioOriginal;

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "center",
      }}
    >
      {/* caja de imagen */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: "100%", md: "40%" },
          maxWidth: "400px",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          image={libro.imagen}
          alt={`portada de ${libro.titulo}`}
          sx={{
            borderRadius: 2,
            maxHeight: "100%",
            maxWidth: "100%",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>
      {/* caja de detalles */}
      <Box sx={{ flexGrow: 1, textAlign: { xs: "center", ms: "left" } }}>
        <Typography variant="h4" gutterBottom>
          {libro.titulo}
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {libro.autor}
        </Typography>

        {libro.oferta && (
          <>
            <Typography variant="h6" color="text.disabled">
              Precio Original:
            </Typography>
            <Typography
              variant="h6"
              color="text.disabled"
              sx={{ textDecoration: "line-through", mb: 0.5 }}
            >
              ${precioOriginal.toLocaleString("es-AR")}
            </Typography>
          </>
        )}
        <Typography variant="h6" color="error.main">
          Precio con descuento:
        </Typography>
        <Typography
          variant="h5"
          color={libro.oferta ? "error.main" : "primary.main"}
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          ${precioConDescuento.toLocaleString("es-AR")}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Stock disponible: {libro.stock} unidades
        </Typography>
        {libro.stock > 0 ? (
          <Button variant="contained" size="large" sx={{ mt: 3 }}>
            Añadir al carrito
          </Button>
        ) : (
          <Button variant="contained" size="large" disabled sx={{ mt: 3 }}>
            SIN STOCK
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default DetalleLibro;
