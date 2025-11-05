import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import LibroCard from "../components/LibroCard.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [librosDestacados, setLibrosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/libros");
        setLibrosDestacados((response.data.libros || response.data).slice(1, 5));
      } catch (error) {
        console.error("Error fetching libros:", error)
        setError("No se pudieron cargar los libros destacados");
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando libros destacados...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", margin: "0 auto" }}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.primary.dark,
          color: "white",
          py: 10,
          textAlign: "center",
          backgroundImage:
            "linear-gradient(rgba(0, 71, 78, 0.8), rgba(0, 71, 78, 0.7)), url('/src/assets/images/hero-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              mb: 3,
              letterSpacing: "0.5px",
            }}
          >
            ¡Oferta Primaveral Exclusiva!
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Pack de <strong>3 libros clásicos</strong> por solo{" "}
            <Box
              component="span"
              sx={{
                color: "secondary.main",
                fontWeight: 700,
                fontSize: "1.2em",
              }}
            >
              $25.000
            </Box>{" "}
            <Box
              component="span"
              sx={{
                textDecoration: "line-through",
                opacity: 0.8,
                mr: 1,
              }}
            >
              $37.000
            </Box>
            <Box
              component="span"
              sx={{
                color: "secondary.main",
                fontWeight: 700,
              }}
            >
              (32% OFF)
            </Box>
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/oferta-especial"
            sx={{
              fontSize: "1.1rem",
              px: 6,
              py: 2,
              borderRadius: "50px",
              fontWeight: 700,
              boxShadow: (theme) => `0 4px 0 ${theme.palette.secondary.dark}`,
              "&:hover": {
                transform: "translateY(2px)",
                boxShadow: (theme) => `0 2px 0 ${theme.palette.secondary.dark}`,
              },
              transition: "all 0.2s ease",
            }}
          >
            Comprar Ahora
          </Button>
        </Container>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Slider {...settings}>
          {[1, 2, 3].map((num) => (
            <div key={`banner-${num}`}>
              <img
                src={`/src/assets/images/banner${num}.jpg`}
                alt={`Banner ${num}`}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
          ))}
        </Slider>
      </Box>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        color="primary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Libros Destacados
      </Typography>

      <Grid container spacing={3} justifyContent="space-around">
        {librosDestacados.map((libro) => (
          <Grid key={libro.id} 

          sx={{xs:12, sm:6, md:3  }}
          
          >
            <LibroCard {...libro} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, my: 6 }}>
        <Button
          sx={{
            minWidth: { xs: "100%", sm: "300px" },
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
          component={Link}
          to="/catalogo"
          variant="contained"
          size="large"
        >
          Ver todos los libros
        </Button>
      </Box>
    </Box>
  );
}

export default Home;