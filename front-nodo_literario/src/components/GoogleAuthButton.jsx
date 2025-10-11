import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleAuthButton = ({ onClick, loading = false, ...props }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      disabled={loading}
      sx={{
        mt: 2,
        mb: 2,
        py: 1.5,
        borderColor: '#DB4437',
        color: '#DB4437',
        '&:hover': {
          borderColor: '#C1351D',
          backgroundColor: 'rgba(219, 68, 55, 0.04)',
        },
        '&:disabled': {
          borderColor: '#CCCCCC',
          color: '#CCCCCC',
        }
      }}
      {...props}
    >
      {loading ? 'Conectando con Google...' : 'Continuar con Google'}
    </Button>
  );
};

export default GoogleAuthButton;