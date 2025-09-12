import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Pagination
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { categoriaService } from '../services/categoriaService';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [formData, setFormData] = useState({ nombre: '' });

  const cargarCategorias = async (page = 1) => {
    try {
      const response = await categoriaService.getCategorias(page, 4);
      setCategorias(response.data.categorias || response.data);
      setTotalPaginas(response.data.pagination?.totalPages || 1);
      setPaginaActual(page);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setCurrentCategoria(categoria);
      setFormData({ nombre: categoria.nombre || '' });
    } else {
      setCurrentCategoria(null);
      setFormData({ nombre: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCategoria(null);
    setFormData({ nombre: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ nombre: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (currentCategoria) {
        await categoriaService.updateCategoria(currentCategoria.id, formData);
      } else {
        await categoriaService.createCategoria(formData);
      }
      cargarCategorias(paginaActual);
      handleCloseModal();
    } catch (error) {
      console.error('Error guardando categoría:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await categoriaService.deleteCategoria(id);
        cargarCategorias(paginaActual);
      } catch (error) {
        console.error('Error eliminando categoría:', error);
      }
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Categorías</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Nueva Categoría
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias && categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(categoria)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(categoria.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPaginas}
          page={paginaActual}
          onChange={(e, value) => cargarCategorias(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currentCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}