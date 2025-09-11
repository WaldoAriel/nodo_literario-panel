import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { AutoStories } from "@mui/icons-material";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu, ShoppingCart } from "@mui/icons-material";

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // items del menú y rutas
  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Libros", path: "/catalogo" },
    { text: "Contacto", path: "/contacto" },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#00474E" }}>
        <Toolbar>
          {/* Menú Hamburguesa */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>

          {/* Logo/Título */}
          <Typography
            variant="h6"
            component={Link} // Para hacer click en el nombre y logo
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              lineHeight: 5,
            }}
          >
            <AutoStories fontSize="large" sx={{ mr: 2 }} />
            Nodo Literario
          </Typography>

          {/* Menú normal */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* perfil */}
          <IconButton color="inherit">
            <Avatar
              src="/ruta/a/imagen-perfil.jpg"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>

          {/* Icono del carrito */}
          <IconButton color="inherit" component={Link} to="/carrito">
            <ShoppingCart />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer para celus */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default NavBar;
