import { useEffect, useState } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LibroCard from "../../components/LibroCard";
import FilterBar from "/src/components/FilterBar";
import axios from "axios";
import { useParams } from "react-router";
import Categorias from "./Categorias";

function Catalogo() {
  const { id_categoria } = useParams();
  
  // 👇 PRIMERO TODOS LOS USEState
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredLibros, setFilteredLibros] = useState([]);
  
  // 👇 ESTADOS PARA PAGINACIÓN
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8
  });
  const [sortBy, setSortBy] = useState("titulo");
  const [sortDirection, setSortDirection] = useState("asc");

  // ESTADO PARA FILTROS
  const [filters, setFilters] = useState({
    search: "",
    autor: "", 
    precio: ""
  });

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = `http://localhost:3000/api/libros?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
        
        if (id_categoria) {
          url += `&id_categoria=${id_categoria}`;
        }
        
        // AGREGAR FILTROS SI EXISTEN
        if (filters.search) {
          url += `&search=${encodeURIComponent(filters.search)}`;
        }
        if (filters.autor) {
          url += `&autor=${encodeURIComponent(filters.autor)}`;
        }
        if (filters.precio) {
          const precioFilter = convertPriceFilter(filters.precio);
          if (precioFilter.min !== undefined) {
            url += `&precioMin=${precioFilter.min}`;
          }
          if (precioFilter.max !== undefined) {
            url += `&precioMax=${precioFilter.max}`;
          }
        }
        
        const response = await axios.get(url);
        const responseData = response.data;

        if (responseData.libros && responseData.pagination) {
          setLibros(responseData.libros);
          setFilteredLibros(responseData.libros);
          setPagination(prev => ({
            ...prev,
            currentPage: responseData.pagination.currentPage,
            totalPages: responseData.pagination.totalPages,
            totalItems: responseData.pagination.totalItems
          }));
        }
        
      } catch (error) {
        console.error("Error al obtener los libros", error);
        setError("No se pudieron cargar los libros. Por favor intentelo nuevamente más tarde");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibros();
  }, [id_categoria, pagination.currentPage, pagination.itemsPerPage, sortBy, sortDirection, filters]);

  // 👇 LUEGO LAS FUNCIONES
  const handlePageChange = (event, value) => {
    setPagination(prev => ({
      ...prev,
      currentPage: value
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    const [field, direction] = value.split('-');
    setSortBy(field);
    setSortDirection(direction);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleItemsPerPageChange = (event) => {
    const itemsPerPage = parseInt(event.target.value);
    setPagination(prev => ({
      ...prev,
      itemsPerPage: itemsPerPage,
      currentPage: 1
    }));
  };

  // FUNCIÓN PARA MANEJAR FILTROS
  const handleSearchChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // FUNCIÓN PARA CONVERTIR FILTROS DE PRECIO
  const convertPriceFilter = (priceRange) => {
    switch (priceRange) {
      case "menos-10k":
        return { max: 10000 };
      case "10k-15k":
        return { min: 10000, max: 15000 };
      case "mas-15k":
        return { min: 15000 };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
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
          minHeight: "100vh",
          backgroundColor: "#aaa",
          color: "red",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#efefef", minHeight: "100vh" }}>
      {/* Barra de filtros */}
      <FilterBar onSearchChange={handleSearchChange} />
      <Categorias />

      {/* 👇 CONTROLES DE PAGINACIÓN Y ORDENAMIENTO */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Información de paginación */}
        <Typography variant="body2" color="text.secondary">
          Mostrando {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
          -
          {Math.min(
            pagination.currentPage * pagination.itemsPerPage,
            pagination.totalItems
          )}
          de {pagination.totalItems} libros
        </Typography>

        {/* Controles de ordenamiento y items por página */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Ordenamiento */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={`${sortBy}-${sortDirection}`}
              onChange={handleSortChange}
              label="Ordenar por"
            >
              <MenuItem value="titulo-asc">Título A-Z</MenuItem>
              <MenuItem value="titulo-desc">Título Z-A</MenuItem>
              <MenuItem value="precio-asc">Precio: Menor a Mayor</MenuItem>
              <MenuItem value="precio-desc">Precio: Mayor a Menor</MenuItem>
              {/* <MenuItem value="createdAt-desc">Más recientes</MenuItem>
              <MenuItem value="createdAt-asc">Más antiguos</MenuItem> */}
            </Select>
          </FormControl>

          {/* Items por página */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Mostrar</InputLabel>
            <Select
              value={pagination.itemsPerPage}
              onChange={handleItemsPerPageChange}
              label="Mostrar"
            >
              <MenuItem value={8}>8 por página</MenuItem>
              <MenuItem value={16}>16 por página</MenuItem>
              <MenuItem value={24}>24 por página</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Grid de libros */}
      <Grid
        container
        columns={12}
        sx={{
          p: 4,
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {filteredLibros.length === 0 && !loading && !error ? (
          <Grid sx={{ width: "100%", textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" sx={{ mt: 4 }}>
              No se encontraron libros en esta categoría
            </Typography>
          </Grid>
        ) : (
          filteredLibros.map((libro) => (
            <Grid
              key={libro.id}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
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

      {/* PAGINACIÓN */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}

export default Catalogo;
