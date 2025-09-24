import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { Search, FilterAlt, Clear } from "@mui/icons-material";

function FilterBar({ libros, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAutor, setSelectedAutor] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Extraer autores únicos para el filtro
  const autoresUnicos = [...new Set(libros.map((p) => p.autor))];

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...libros];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedAutor) {
      filtered = filtered.filter((p) => p.autor === selectedAutor);
    }

    if (priceRange) {
      switch (priceRange) {
        case "menos-10k":
          filtered = filtered.filter((p) => p.precio < 10000);
          break;
        case "10k-15k":
          filtered = filtered.filter(
            (p) => p.precio >= 10000 && p.precio <= 15000
          );
          break;
        case "mas-15k":
          filtered = filtered.filter((p) => p.precio > 15000);
          break;
        default:
          break;
      }
    }

    onFilter(filtered);
  };

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAutor("");
    setPriceRange("");
    onFilter(libros);
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FilterAlt sx={{ mr: 1 }} /> Filtros
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {/* Búsqueda por título */}
        <TextField
          label="Buscar por título"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilters();
            }
          }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
          }}
          sx={{ flexGrow: 1 }}
        />

        {/* Filtro por autor */}
        <TextField
          select
          label="Autor"
          size="small"
          value={selectedAutor}
          onChange={(e) => setSelectedAutor(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {autoresUnicos.map((autor) => (
            <MenuItem key={autor} value={autor}>
              {autor}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por precio */}
        <TextField
          select
          label="Rango de precio"
          size="small"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="menos-10k">Menos de $10k</MenuItem>
          <MenuItem value="10k-15k">$10k - $15k</MenuItem>
          <MenuItem value="mas-15k">Más de $15k</MenuItem>
        </TextField>

        {/* Botones */}
        <Button
          variant="contained"
          onClick={applyFilters}
          startIcon={<FilterAlt />}
        >
          Filtrar
        </Button>
        <Button variant="outlined" onClick={resetFilters} startIcon={<Clear />}>
          Limpiar
        </Button>
      </Stack>

      {/* Chips de filtros activos (opcional) */}
      <Box sx={{ mt: 2 }}>
        {selectedAutor && (
          <Chip
            label={`Autor: ${selectedAutor}`}
            onDelete={() => setSelectedAutor("")}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
        {priceRange && (
          <Chip
            label={`Precio: ${
              {
                "menos-10k": "Menos de $10k",
                "10k-15k": "$10k-$15k",
                "mas-15k": "Más de $15k",
              }[priceRange]
            }`}
            onDelete={() => setPriceRange("")}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
      </Box>
    </Box>
  );
}

export default FilterBar;
