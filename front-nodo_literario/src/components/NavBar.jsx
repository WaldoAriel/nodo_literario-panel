import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem, Divider, Badge, Chip } from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  ExitToApp,
  AccountCircle,
} from "@mui/icons-material";

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
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import LogoSVG from "../assets/logo-nodo-literario-blanco.svg";

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
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
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/perfil");
  };

  // Items del menú principal
  const menuItems = [
    { text: "Inicio", path: "/", icon: "🏠" },
    { text: "Catálogo", path: "/catalogo", icon: "📚" },
    { text: "Categorías", path: "/categorias", icon: "🏷️" },
    { text: "Contacto", path: "/contacto", icon: "📞" },
  ];

  // Generar iniciales para el avatar
  const getUserInitials = () => {
    if (!user) return "U";
    return (
      `${user.nombre?.charAt(0) || ""}${
        user.apellido?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  // Drawer para celus
  const drawer = (
    <Box sx={{ width: 280 }} onClick={handleDrawerToggle}>
      {/* Header del drawer */}
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          {/* Ícono del Drawer */}
          <Box
            component="img"
            src={LogoSVG}
            alt="Logo"
            sx={{
              mr: 1,
              height: 28,
              width: "auto",
            }}
          />
          Nodo Literario
        </Typography>
        {isAuthenticated && (
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Hola, {user?.nombre}
          </Typography>
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              color: "inherit",
              textDecoration: "none",
              borderLeft: "3px solid transparent",
              "&:hover": {
                borderLeft: "3px solid",
                borderColor: "primary.main",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, fontSize: "1.2rem" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Sección de usuario */}
        {isAuthenticated ? (
          <>
            <ListItem
              component={Link}
              to="/perfil"
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Mi Perfil" />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              component={Link}
              to="/login"
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Ingresar" />
            </ListItem>
            <ListItem
              component={Link}
              to="/registro"
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Registrarse" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#00474E",
          background: "linear-gradient(135deg, #00474E 0%, #006B76 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ minHeight: "100px !important" }}>
          {/* Menú Hamburguesa */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo y Nombre */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              flexGrow: { xs: 1, sm: 0 },
              mr: { sm: 4 },
            }}
          >
            {/* Ícono */}
            <Box
              component="img"
              src={LogoSVG}
              alt="Logo Nodo Literario"
              sx={{
                mr: 2,
                height: 48,
                width: "auto",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #FFFFFF, #E0F7FA)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Nodo Literario
            </Typography>
          </Box>

          {/* Menú de Navegación (Desktop) */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              flexGrow: 1,
              gap: 1,
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                startIcon={
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                }
                sx={{
                  borderRadius: 2,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-1px)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Menú de Navegación (Tablet) */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex", lg: "none" },
              flexGrow: 1,
              gap: 0.5,
            }}
          >
            {menuItems.slice(0, 3).map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  minWidth: "auto",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {item.icon}
              </Button>
            ))}
          </Box>

          {/* Área de Usuario y Carrito */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, sm: 3, md: 5 },
              ml: "auto",
            }}
          >
            <Tooltip title="Ver carrito" arrow>
              <IconButton
                color="inherit"
                component={Link}
                to="/carrito"
                sx={{
                  position: "relative",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 2,
                  p: 1.2,
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    borderRadius: 10,
                    transform: "scale(1.05)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                <Badge
                  badgeContent={cart.cantidadTotal}
                  color="secondary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      minWidth: "20px",
                      height: "20px",
                      transform: "scale(1.1) translate(50%, -20%)",
                    },
                  }}
                >
                  <ShoppingCart sx={{ fontSize: "1.7rem" }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Usuario Autenticado */}
            {isAuthenticated ? (
              <>
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={<AccountCircle />}
                    label={`Hola, ${user?.nombre}`}
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                </Box>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: "secondary.main",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: "text.primary",
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              // Usuario No Autenticado
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Versión completa (md en adelante) */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    startIcon={<Person />}
                    sx={{
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Ingresar
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/registro"
                    startIcon={<AccountCircle />}
                    sx={{
                      backgroundColor: "secondary.main",
                      color: "text.primary",
                      borderRadius: 2,
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "secondary.dark",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    Registrarse
                  </Button>
                </Box>

                {/* Versión compacta para tablets (600px - 900px) */}
                <Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5 }}>
                  <Tooltip title="Ingresar" arrow>
                    <IconButton
                      color="inherit"
                      component={Link}
                      to="/login"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      <Person />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Registrarse" arrow>
                    <IconButton
                      color="inherit"
                      component={Link}
                      to="/registro"
                      sx={{
                        backgroundColor: "secondary.main",
                        color: "text.primary",
                        "&:hover": {
                          backgroundColor: "secondary.dark",
                        },
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* Menú desplegable del usuario */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: "visible",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
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
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default NavBar;
