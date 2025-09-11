import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006D77', // Turquesa profundo
      light: '#83C5BE', // Turquesa claro
      dark: '#00474E', // Turquesa oscuro
      contrastText: '#FFFFFF', // Texto blanco
    },
    secondary: {
      main: '#FFDDD2', // Coral suave
      light: '#FFEEE8',
      dark: '#E8C4B8',
    },
    background: {
      default: '#EDF6F9', // Fondo blanco azulado muy claro
      paper: '#FFFFFF', // Fondo blanco para cards
    },
    text: {
      primary: '#1E1E1E', // Casi negro 
      secondary: '#006D77', // Turquesa 
    },
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none', // Botones sin mayús
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 109, 119, 0.1)', 
        },
      },
    },
  },
});

export default theme;