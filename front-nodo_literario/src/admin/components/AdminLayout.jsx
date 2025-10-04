import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  ExitToApp,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Libros', icon: <BookIcon />, path: '/admin/libros' },
  { text: 'Autores', icon: <PersonIcon />, path: '/admin/autores' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categorias' },
];

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, adminLogout } = useAdminAuth();

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
    adminLogout();
    handleMenuClose();
    navigate('/admin/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    // Aquí puedes navegar a un perfil de admin si lo implementas después
  };

  // Generar iniciales para el avatar
  const getAdminInitials = () => {
    if (!admin) return 'A';
    const names = admin.email.split('@')[0].split('.');
    return names.map(name => name.charAt(0).toUpperCase()).join('') || 'A';
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Panel Administrativo
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Título */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Nodo Literario - Admin
          </Typography>

          {/* Menú de usuario admin */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {admin?.email}
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
                {getAdminInitials()}
              </Avatar>
            </IconButton>

            {/* Menú desplegable */}
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
                <AccountCircle sx={{ mr: 1 }} />
                Mi Perfil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}