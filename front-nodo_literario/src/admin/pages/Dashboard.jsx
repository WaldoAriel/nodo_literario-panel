import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { Book, Person, Category, Warning } from "@mui/icons-material";

export default function Dashboard() {
  // Datos de ejemplo
  const stats = {
    totalLibros: 132,
    totalAutores: 45,
    totalCategorias: 12,
    stockBajo: 11,
    nuevosEsteMes: 8,
  };

  const categorias = [
    { nombre: "Novela", cantidad: 45, porcentaje: 34 },
    { nombre: "Cuento", cantidad: 32, porcentaje: 24 },
    { nombre: "Poesía", cantidad: 28, porcentaje: 21 },
    { nombre: "Fantasía", cantidad: 15, porcentaje: 11 },
    { nombre: "Ensayo", cantidad: 12, porcentaje: 9 },
  ];

  const librosStockBajo = [
    { titulo: "Cien años de soledad", stock: 2 },
    { titulo: "1984", stock: 1 },
    { titulo: "El principito", stock: 3 },
    { titulo: "Don Quijote", stock: 2 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard - Gestión de Biblioteca
      </Typography>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Book sx={{ fontSize: 40, color: "#0088FE", mb: 1 }} />
              <Typography variant="h4" color="#0088FE">
                {stats.totalLibros}
              </Typography>
              <Typography variant="h6">Total Libros</Typography>
              <Typography variant="body2" color="#0088FE">
                +{stats.nuevosEsteMes} este mes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Person sx={{ fontSize: 40, color: "#00C49F", mb: 1 }} />
              <Typography variant="h4" color="#00C49F">
                {stats.totalAutores}
              </Typography>
              <Typography variant="h6">Autores</Typography>
              <Typography variant="body2" color="#00C49F">
                Registrados en el sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Category sx={{ fontSize: 40, color: "#FFBB28", mb: 1 }} />
              <Typography variant="h4" color="#FFBB28">
                {stats.totalCategorias}
              </Typography>
              <Typography variant="h6">Categorías</Typography>
              <Typography variant="body2" color="#FFBB28">
                Activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Warning sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {stats.stockBajo}
              </Typography>
              <Typography variant="h6">Stock Bajo</Typography>
              <Typography variant="body2" color="text.secondary">
                Necesitan atención
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas detalladas */}
      <Grid container spacing={3}>
        {/* Distribución por categorías */}
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Categorías
            </Typography>
            <Box sx={{ mt: 2 }}>
              {categorias.map((categoria, index) => (
                <Box key={categoria.nombre} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{categoria.nombre}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {categoria.cantidad} ({categoria.porcentaje}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={categoria.porcentaje}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: [
                          "#0088FE",
                          "#00C49F",
                          "#FFBB28",
                          "#FF8042",
                          "#8884D8",
                        ][index % 5],
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Libros con stock bajo */}
        <Grid sx={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Libros con Stock Bajo
            </Typography>
            <List>
              {librosStockBajo.map((libro) => (
                <ListItem key={libro.titulo} divider>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={libro.titulo}
                    secondary={`Stock: ${libro.stock} unidades`}
                  />
                  <Chip
                    label="Bajo Stock"
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Resumen rápido */}
        <Grid sx={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen Rápido
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" color="primary.main">
                    85%
                  </Typography>
                  <Typography variant="body2">Autores Activos</Typography>
                </Box>
              </Grid>
              <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" color="success.main">
                    92%
                  </Typography>
                  <Typography variant="body2">Libros Disponibles</Typography>
                </Box>
              </Grid>
              <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" color="info.main">
                    15
                  </Typography>
                  <Typography variant="body2">Nuevos este Mes</Typography>
                </Box>
              </Grid>
              <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h3" color="warning.main">
                    8%
                  </Typography>
                  <Typography variant="body2">Stock Bajo</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
