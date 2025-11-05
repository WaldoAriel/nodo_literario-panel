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
  Avatar,
  Badge,
  Chip,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  ExitToApp,
  AccountCircle,
  Notifications,
  TrendingUp,
  ChevronLeft
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

// Importar el logo
import LogoBlanco from '../../assets/logo-nodo-literario-blanco.svg';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Gestión de Libros', icon: <BookIcon />, path: '/admin/libros' },
  { text: 'Gestión de Autores', icon: <PersonIcon />, path: '/admin/autores' },
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
    navigate('/admin/perfil');
  };

  const getAdminInitials = () => {
    if (!admin) return 'A';
    const names = admin.email.split('@')[0].split('.');
    return names.map(name => name.charAt(0).toUpperCase()).join('') || 'A';
  };


  const drawer = (
    <Box sx={{ 
      background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      height: '100%',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header del drawer + logo*/}
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Logo */}
            <Box
              component="img"
              src={LogoBlanco}
              alt="Nodo Literario"
              sx={{
                height: 52,
                width: 'auto',
                display: 'block'
              }}
            />
          </Box>
          {!isMobile && (
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{ color: 'white' }}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
          )}
        </Box>
        
        {/* Nombre y información */}
        <Box sx={{ textAlign: 'left' }}>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              fontSize: '1.4rem',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            Nodo Literario
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.8,
              display: 'block',
              lineHeight: 1.2
            }}
          >
            Panel Administrativo
          </Typography>
        </Box>
        
        {/* Chip de estado */}
        <Chip 
          label="En línea" 
          size="small" 
          color="success"
          sx={{ 
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            mt: 1,
            height: 24,
            '& .MuiChip-label': {
              px: 1,
              fontSize: '0.7rem'
            }
          }}
        />
      </Box>
      
      <Divider sx={{ borderColor: alpha('#fff', 0.2), my: 1 }} />
      
      {/* Menú de navegación */}
      <List sx={{ p: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  backgroundColor: isSelected ? alpha('#fff', 0.15) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.1),
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha('#fff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.2),
                    },
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isSelected ? 'white' : alpha('#fff', 0.7),
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400
                  }}
                />
                {isSelected && (
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      ml: 1
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Footer del Drawer */}
      <Box sx={{ p: 2, pt: 1 }}>
        <Divider sx={{ borderColor: alpha('#fff', 0.2), mb: 2 }} />
        <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
          v2.1.0 • Sistema estable
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* AppBar Mejorado */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Lado izquierdo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                color: 'primary.main'
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo pequeño para mobile */}
            <Box
              component="img"
              src={LogoBlanco}
              alt="Nodo Literario"
              sx={{
                height: 30,
                width: 'auto',
                display: { xs: 'block', md: 'none' },
                mr: 2
              }}
            />
            
            {/* Breadcrumb o título de página */}
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>

          {/* Lado derecho - Acciones del usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notificaciones */}
            <IconButton color="primary">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Estadísticas rápidas */}
            <Chip 
              icon={<TrendingUp sx={{ fontSize: 16 }} />}
              label="+12% este mes" 
              variant="outlined"
              size="small"
              color="success"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            />

            {/* Información del usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="subtitle2" fontWeight="600">
                  {admin?.nombre || 'Administrador'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {admin?.email}
                </Typography>
              </Box>
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  border: `2px solid ${theme.palette.primary.light}`,
                  padding: '2px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    backgroundColor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getAdminInitials()}
                </Avatar>
              </IconButton>

              {/* Menú desplegable mejorado */}
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
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                  Mi Perfil
                </MenuItem>
                <MenuItem>
                  <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                  Notificaciones
                  <Chip 
                    label="3" 
                    size="small" 
                    color="error" 
                    sx={{ ml: 'auto', height: 20, fontSize: '0.75rem' }}
                  />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
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
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
              },
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
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar />
        <Box
          sx={{
            borderRadius: 3,
            minHeight: 'calc(100vh - 100px)'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}