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

function FilterBar({ onSearchChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAutor, setSelectedAutor] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // FUNCIÓN PARA NORMALIZAR TEXTO
  const normalizarTexto = (texto) => {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "");
  };

  // 👇 APLICAR FILTROS
  const applyFilters = () => {
    const filters = {
      search: searchTerm,
      autor: selectedAutor,
      precio: priceRange,
    };
    
    onSearchChange(filters);
  };

  // 👇 RESETEAR FILTROS
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAutor("");
    setPriceRange("");
    
    onSearchChange({
      search: "",
      autor: "",
      precio: ""
    });
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
          placeholder="Ej: 'tunel' encontrará 'El Túnel'"
        />

        {/* 👇 Filtro por autor - INPUT MANUAL */}
        <TextField
          label="Buscar por autor"
          variant="outlined"
          size="small"
          value={selectedAutor}
          onChange={(e) => setSelectedAutor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applyFilters();
            }
          }}
          sx={{ minWidth: 150 }}
          placeholder="Nombre del autor"
        />

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

      {/* Chips de filtros activos */}
      <Box sx={{ mt: 2 }}>
        {searchTerm && (
          <Chip
            label={`Búsqueda: "${searchTerm}"`}
            onDelete={() => {
              setSearchTerm("");
              applyFilters();
            }}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
        {selectedAutor && (
          <Chip
            label={`Autor: ${selectedAutor}`}
            onDelete={() => {
              setSelectedAutor("");
              applyFilters();
            }}
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
            onDelete={() => {
              setPriceRange("");
              applyFilters();
            }}
            sx={{ mr: 1, mb: 1 }}
          />
        )}
      </Box>

      {/* Mensaje de ayuda */}
      {searchTerm && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          💡 La búsqueda ignora tildes y mayúsculas
        </Typography>
      )}
    </Box>
  );
}

export default FilterBar;