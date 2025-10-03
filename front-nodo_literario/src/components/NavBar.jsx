import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider 
} from "@mui/material";
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
import { Menu as MenuIcon, ShoppingCart } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    // Aquí podrías navegar a un perfil de usuario si lo implementas
  };

  // items del menú y rutas
  const menuItems = [
    { text: "Inicio", path: "/" },
    { text: "Libros", path: "/catalogo" },
    { text: "Contacto", path: "/contacto" },
  ];

  // Items adicionales para usuarios autenticados
  const authMenuItems = isAuthenticated ? [
    { text: "Mi Perfil", path: "/perfil" }, // Puedes crear esta ruta después
  ] : [];

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
        
        {/* Items adicionales para usuarios autenticados en el drawer */}
        {isAuthenticated && authMenuItems.map((item) => (
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
        
        {/* Login/Logout en drawer */}
        <ListItem>
          {isAuthenticated ? (
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={handleLogout}
              sx={{ color: 'primary.main', borderColor: 'primary.main' }}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button 
                variant="outlined" 
                component={Link}
                to="/login"
                fullWidth
                sx={{ color: 'primary.main', borderColor: 'primary.main' }}
              >
                Ingresar
              </Button>
              <Button 
                variant="contained" 
                component={Link}
                to="/registro"
                fullWidth
              >
                Registrarse
              </Button>
            </Box>
          )}
        </ListItem>
      </List>
    </Box>
  );

  // Generar iniciales para el avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

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
            <MenuIcon />
          </IconButton>

          {/* Logo/Título */}
          <Typography
            variant="h6"
            component={Link}
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

          {/* Botones de autenticación (escritorio) */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Typography 
                  variant="body2" 
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Hola, {user?.nombre}
                </Typography>
                <IconButton 
                  color="inherit" 
                  onClick={handleMenuOpen}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      backgroundColor: 'primary.light',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </IconButton>
                
                {/* Menú desplegable del usuario */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                    }
                  }}
                >
                  <MenuItem onClick={handleProfile}>
                    Mi Perfil
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link}
                  to="/login"
                  sx={{ 
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Ingresar
                </Button>
                <Button 
                  variant="contained" 
                  component={Link}
                  to="/registro"
                  sx={{ 
                    backgroundColor: 'secondary.main',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'secondary.dark',
                    }
                  }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>

          {/* Icono del carrito */}
          <IconButton color="inherit" component={Link} to="/carrito">
            <ShoppingCart />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer para móviles */}
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