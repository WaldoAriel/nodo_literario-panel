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
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
} from "@mui/material";
import {
  Book,
  Person,
  Category,
  Warning,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Visibility,
} from "@mui/icons-material";

export default function Dashboard() {
  // Datos de ejemplo mejorados
  const stats = {
    totalLibros: 132,
    totalAutores: 45,
    totalCategorias: 12,
    stockBajo: 11,
    nuevosEsteMes: 8,
    prestamosActivos: 23,
    usuariosRegistrados: 156,
  };

  const categorias = [
    { nombre: "Novela", cantidad: 45, porcentaje: 34, tendencia: "up" },
    { nombre: "Cuento", cantidad: 32, porcentaje: 24, tendencia: "up" },
    { nombre: "Poesía", cantidad: 28, porcentaje: 21, tendencia: "stable" },
    { nombre: "Fantasía", cantidad: 15, porcentaje: 11, tendencia: "up" },
    { nombre: "Ensayo", cantidad: 12, porcentaje: 9, tendencia: "down" },
  ];

  const librosStockBajo = [
    {
      titulo: "Cien años de soledad",
      stock: 2,
      autor: "Gabriel García Márquez",
    },
    { titulo: "1984", stock: 1, autor: "George Orwell" },
    { titulo: "El principito", stock: 3, autor: "Antoine de Saint-Exupéry" },
    { titulo: "Don Quijote", stock: 2, autor: "Miguel de Cervantes" },
  ];

  const metricCards = [
    {
      title: "Total Libros",
      value: stats.totalLibros,
      change: "+12%",
      trend: "up",
      icon: <Book sx={{ fontSize: 30 }} />,
      color: "#0088FE",
    },
    {
      title: "Autores Activos",
      value: stats.totalAutores,
      change: "+5%",
      trend: "up",
      icon: <Person sx={{ fontSize: 30 }} />,
      color: "#00C49F",
    },
    {
      title: "Categorías",
      value: stats.totalCategorias,
      change: "+2",
      trend: "up",
      icon: <Category sx={{ fontSize: 30 }} />,
      color: "#FFBB28",
    },
    {
      title: "Stock Bajo",
      value: stats.stockBajo,
      change: "-3%",
      trend: "down",
      icon: <Warning sx={{ fontSize: 30 }} />,
      color: "#FF8042",
    },
  ];

  return (
    <Box>
      {/* Header del Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Dashboard General
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen completo del estado de la biblioteca
        </Typography>
      </Box>

      {/* Tarjetas de métricas mejoradas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                position: "relative",
                overflow: "visible",
                "&:hover": {
                  transform: "translateY(-4px)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={card.color}
                    >
                      {card.value}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {card.title}
                    </Typography>
                    <Chip
                      icon={
                        card.trend === "up" ? <TrendingUp /> : <TrendingDown />
                      }
                      label={card.change}
                      size="small"
                      color={card.trend === "up" ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${card.color}15`,
                      borderRadius: 2,
                      p: 1,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección de gráficos y listas */}
      <Grid container spacing={3}>
        {/* Distribución por categorías */}
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Distribución por Categorías
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              {categorias.map((categoria, index) => (
                <Box key={categoria.nombre} sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" fontWeight="500">
                        {categoria.nombre}
                      </Typography>
                      {categoria.tendencia === "up" && (
                        <TrendingUp
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      )}
                      {categoria.tendencia === "down" && (
                        <TrendingDown
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary"
                    >
                      {categoria.cantidad} ({categoria.porcentaje}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={categoria.porcentaje}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "grey.100",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
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
        <Grid sx={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Libros con Stock Bajo
              </Typography>
              <Chip
                label={`${stats.stockBajo} libros`}
                color="warning"
                size="small"
              />
            </Box>

            <List disablePadding>
              {librosStockBajo.map((libro, index) => (
                <ListItem
                  key={libro.titulo}
                  divider={index !== librosStockBajo.length - 1}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        backgroundColor: "warning.light",
                        borderRadius: 2,
                        p: 1,
                        color: "warning.contrastText",
                      }}
                    >
                      <Warning sx={{ fontSize: 20 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="500">
                        {libro.titulo}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {libro.autor}
                      </Typography>
                    }
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Chip
                      label={`${libro.stock} unidades`}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      color="error.main"
                      sx={{ mt: 0.5 }}
                    >
                      Stock crítico
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                startIcon={<Visibility />}
              >
                Ver todos los libros con stock bajo
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Estadísticas rápidas */}
        <Grid sx={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Resumen de Actividad
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  label: "Tasa de disponibilidad",
                  value: "94%",
                  change: "+2%",
                  trend: "up",
                },
                {
                  label: "Nuevos registros",
                  value: "28",
                  change: "+12%",
                  trend: "up",
                },
                {
                  label: "Préstamos activos",
                  value: "23",
                  change: "-5%",
                  trend: "down",
                },
                {
                  label: "Libros revisados",
                  value: "45",
                  change: "+8%",
                  trend: "up",
                },
              ].map((stat, index) => (
                <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.label}
                    </Typography>
                    <Chip
                      icon={
                        stat.trend === "up" ? <TrendingUp /> : <TrendingDown />
                      }
                      label={stat.change}
                      size="small"
                      color={stat.trend === "up" ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
