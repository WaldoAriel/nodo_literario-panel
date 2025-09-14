import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Panel de administración. Acá gestionamos libros, autores y categorías. ¡EN CONSTRUCCIÓN!
        </Typography>
      </Paper>
    </Box>
  );
}