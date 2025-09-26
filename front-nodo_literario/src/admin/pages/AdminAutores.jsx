import React, { useState, useEffect } from "react";
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
  Pagination,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { autorService } from "../services/autorService";

export default function AdminAutores() {
  const [autores, setAutores] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentAutor, setCurrentAutor] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
  });

  const cargarAutores = async (page = 1) => {
    try {
      const response = await autorService.getAutores(page, 4);
      setAutores(response.data.autores || response.data);
      setTotalPaginas(response.data.pagination?.totalPages || 1);
      setPaginaActual(page);
    } catch (error) {
      console.error("Error cargando autores:", error);
      setAutores([]);
    }
  };

  useEffect(() => {
    cargarAutores();
  }, []);

  const handleOpenModal = (autor = null) => {
    if (autor) {
      setCurrentAutor(autor);
      setFormData({
        nombre: autor.nombre || "",
        apellido: autor.apellido || "",
      });
    } else {
      setCurrentAutor(null);
      setFormData({ nombre: "", apellido: "" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentAutor(null);
    setFormData({ nombre: "", apellido: "" });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (currentAutor) {
        await autorService.updateAutor(currentAutor.id, formData);
      } else {
        await autorService.createAutor(formData);
      }
      cargarAutores(paginaActual);
      handleCloseModal();
    } catch (error) {
      console.error("Error guardando autor:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este autor?")) {
      try {
        await autorService.deleteAutor(id);
        cargarAutores(paginaActual);
      } catch (error) {
        console.error("Error eliminando autor:", error);
      }
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Gestión de Autores</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Autor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Apellido</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {autores &&
              autores.map((autor) => (
                <TableRow key={autor.id}>
                  <TableCell>{autor.apellido}</TableCell>
                  <TableCell>{autor.nombre}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(autor)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(autor.id)}>
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
          onChange={(e, value) => cargarAutores(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currentAutor ? "Editar Autor" : "Nuevo Autor"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="apellido"
            label="Apellido"
            fullWidth
            variant="outlined"
            value={formData.apellido}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="nombre"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={formData.nombre}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
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
