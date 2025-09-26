import { useEffect, useState } from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import LibroCard from "../../components/LibroCard";
import FilterBar from "/src/components/FilterBar";
import axios from "axios";
import { useParams } from "react-router";
import Categorias from "./Categorias";

function Catalogo() {
  const { id_categoria } = useParams();
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredLibros, setFilteredLibros] = useState([]);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = "http://localhost:3000/api/libros";
        if (id_categoria) {
          url = `${url}?id_categoria=${id_categoria}`;
        }
        const response = await axios.get(url);
        
        const fetchedLibros = response.data.libros || response.data;
        
        // ordena alfabéticamente x título
        const sortedLibros = fetchedLibros.sort((a, b) => {
          if (a.titulo && b.titulo) {
            return a.titulo.localeCompare(b.titulo);
          }
          return 0;
        });

        // setea los libros ordenados en el estado
        setLibros(sortedLibros);
        
      } catch (error) {
        console.error("Error al obtener los libros", error);
        setError(
          "No se pudieron cargar los libros. Por favor intentelo nuevamente más tarde"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLibros();
  }, [id_categoria]);

  useEffect(() => {
    setFilteredLibros(libros);
  }, [libros]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#aaa",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando los libros...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#aaa",
          color: "red",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#efefef", minHeight: "100vh" }}>
      {/* Barra de filtros */}
      <FilterBar libros={libros} onFilter={setFilteredLibros} />
      <Categorias />

      <Grid
        container
        spacing={3}
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {filteredLibros.length === 0 && !loading && !error ? (
          <Typography variant="h6" color="textSecondary" sx={{ mt: 4 }}>
            No se encontraron libros en esta categoría
          </Typography>
        ) : (
          filteredLibros.map((libro) => (
            <Grid key={libro.id} sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <LibroCard
                id={libro.id}
                titulo={libro.titulo}
                autor={libro.autor}
                imagen={libro.imagen}
                precio={libro.precio}
                stock={libro.stock}
                oferta={libro.oferta}
                descuento={libro.descuento}
              />
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default Catalogo;