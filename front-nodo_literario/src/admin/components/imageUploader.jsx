import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Chip
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

export default function ImageUploader({ 
  onImageSelect, 
  existingImages = [], 
  onRemoveExisting 
}) {
  const [previews, setPreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Previsualizaciones de imágenes existentes (URLs)
    const existingPreviews = existingImages.map(img => ({
      type: 'existing',
      url: img,
      id: img // Usamos la URL como ID temporal
    }));
    
    // Previsualizaciones de nuevas imágenes (Files)
    const newPreviews = newImages.map((file, index) => ({
      type: 'new',
      url: URL.createObjectURL(file),
      id: `new-${index}`,
      file: file
    }));
    
    setPreviews([...existingPreviews, ...newPreviews]);
  }, [existingImages, newImages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
      onImageSelect([...newImages, ...files]);
    }
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    if (imageToRemove.type === 'existing' && onRemoveExisting) {
      // Eliminar imagen existente
      onRemoveExisting(imageToRemove.url);
    } else if (imageToRemove.type === 'new') {
      // Eliminar nueva imagen
      const updatedNewImages = newImages.filter((file, index) => 
        `new-${index}` !== imageToRemove.id
      );
      setNewImages(updatedNewImages);
      onImageSelect(updatedNewImages);
    }
    
    // Liberar URL de objeto si es nueva imagen
    if (imageToRemove.type === 'new') {
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  const handleRemoveAll = () => {
    newImages.forEach((file, index) => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    setNewImages([]);
    onImageSelect([]);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
        id="image-upload"
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <label htmlFor="image-upload">
          <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
            Agregar imágenes
          </Button>
        </label>
        
        {newImages.length > 0 && (
          <Button variant="text" color="error" onClick={handleRemoveAll}>
            Eliminar todas las nuevas
          </Button>
        )}
      </Box>

      {previews.length > 0 && (
        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {previews.length} imagen(es) seleccionada(s). 
            <strong> La primera será la portada.</strong>
          </Typography>
          
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {previews.map((preview, index) => (
              <Box key={preview.id} sx={{ position: "relative" }}>
                <img
                  src={preview.url}
                  alt={`Vista previa ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: index === 0 ? "3px solid #1976d2" : "1px solid #ddd"
                  }}
                />
                {index === 0 && (
                  <Chip 
                    label="Portada" 
                    size="small" 
                    color="primary"
                    sx={{ 
                      position: "absolute", 
                      top: -10, 
                      left: -10,
                      fontSize: '0.7rem'
                    }} 
                  />
                )}
                <IconButton
                  onClick={() => handleRemoveImage(preview)}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: "grey.100"
                    }
                  }}
                  size="small"
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
                <Typography variant="caption" display="block" textAlign="center">
                  {preview.type === 'existing' ? 'Existente' : 'Nueva'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}