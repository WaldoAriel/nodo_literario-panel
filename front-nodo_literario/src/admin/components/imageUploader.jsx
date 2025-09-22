import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';

export default function ImageUploader({ onImageUpload, existingImage }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(existingImage || '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Previsualizar
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    // Subir archivo
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('imagen', file);

      const response = await fetch('http://localhost:3000/api/admin/libros/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      onImageUpload(data.path); // Devuelve la ruta del archivo
    } catch (error) {
      console.error('Error subiendo imagen:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: 'none' }}
        id="image-upload"
      />
      
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUpload />}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={20} /> : 'Seleccionar imagen'}
        </Button>
      </label>

      {previewUrl && (
        <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              borderRadius: '8px' 
            }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{ 
              position: 'absolute', 
              top: -10, 
              right: -10, 
              backgroundColor: 'white' 
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}