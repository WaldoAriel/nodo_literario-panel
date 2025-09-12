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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  ListItemText,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { libroService } from "../../admin/services/libroService";
import { relacionesService } from "../services/relacionesService";

export default function AdminLibros() {
  const [libros, setLibros] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentLibro, setCurrentLibro] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [autores, setAutores] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    id_editorial: "",
    autores: [],
    activa: true,
    oferta: false,
    descuento: 0,
  });

  // Cargar libros
  const cargarLibros = async (page = 1) => {
    try {
      const response = await libroService.getLibros(page, 4);
      setLibros(response.data.libros);
      setTotalPaginas(response.data.pagination.totalPages);
      setPaginaActual(page);
    } catch (error) {
      console.error("Error cargando libros:", error);
      setLibros([]);
    }
  };

  // Cargar datos para los selects
  const cargarDatosRelaciones = async () => {
    try {
      const [catResponse, editResponse, autResponse] = await Promise.all([
        relacionesService.getCategorias(),
        relacionesService.getEditoriales(),
        relacionesService.getAutores(),
      ]);
      setCategorias(catResponse.data.categorias || catResponse.data);
      setEditoriales(editResponse.data.editoriales || editResponse.data);
      setAutores(autResponse.data.autores || autResponse.data);
    } catch (error) {
      console.error("Error cargando datos de relaciones:", error);
    }
  };

  useEffect(() => {
    cargarLibros();
    cargarDatosRelaciones();
  }, []);

  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    cargarLibros(value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenModal = (libro = null) => {
    if (libro) {
      setCurrentLibro(libro);
      setFormData({
        titulo: libro.titulo || "",
        isbn: libro.isbn || "",
        descripcion: libro.descripcion || "",
        precio: libro.precio || "",
        stock: libro.stock || "",
        id_categoria: libro.id_categoria || "",
        id_editorial: libro.id_editorial || "",
        autores: libro.autores ? libro.autores.map(a => a.id) : [],
        activa: libro.activa || true,
        oferta: libro.oferta || false,
        descuento: libro.descuento || 0,
      });
    } else {
      setCurrentLibro(null);
      setFormData({
        titulo: "",
        isbn: "",
        descripcion: "",
        precio: "",
        stock: "",
        id_categoria: "",
        id_editorial: "",
        autores: [],
        activa: true,
        oferta: false,
        descuento: 0,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLibro(null);
  };

  const handleSave = async () => {
    try {
      const libroData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        descuento: formData.oferta ? parseFloat(formData.descuento) : 0,
      };

      if (currentLibro) {
        await libroService.updateLibro(currentLibro.id, libroData);
      } else {
        await libroService.createLibro(libroData);
      }
      cargarLibros(paginaActual);
      handleCloseModal();
    } catch (error) {
      console.error("Error guardando libro:", error);
    }
  };

  // Eliminar libro
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este libro?")) {
      try {
        await libroService.deleteLibro(id);
        cargarLibros(paginaActual);
      } catch (error) {
        console.error("Error eliminando libro:", error);
      }
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestión de Libros</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Libro
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {libros && libros.length > 0 ? (
              libros.map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell>{libro.titulo}</TableCell>
                  <TableCell>
                    {libro.autores && libro.autores.length > 0
                      ? libro.autores
                          .map((autor) => `${autor.nombre} ${autor.apellido}`)
                          .join(", ")
                      : "Sin autor"}
                  </TableCell>
                  <TableCell>${libro.precio}</TableCell>
                  <TableCell>{libro.stock}</TableCell>
                  <TableCell>{libro.categoria?.nombre || "Sin categoría"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(libro)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(libro.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay libros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPaginas}
          page={paginaActual}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentLibro ? "Editar Libro" : "Nuevo Libro"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="titulo"
            label="Título"
            fullWidth
            variant="outlined"
            value={formData.titulo}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="isbn"
            label="ISBN"
            fullWidth
            variant="outlined"
            value={formData.isbn}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.descripcion}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              name="precio"
              label="Precio"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.precio}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.stock}
              onChange={handleInputChange}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="id_categoria"
                value={formData.id_categoria || ""}
                onChange={handleInputChange}
                label="Categoría"
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Editorial</InputLabel>
              <Select
                name="id_editorial"
                value={formData.id_editorial || ""}
                onChange={handleInputChange}
                label="Editorial"
              >
                {editoriales.map((edit) => (
                  <MenuItem key={edit.id} value={edit.id}>
                    {edit.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Autores</InputLabel>
            <Select
              multiple
              name="autores"
              value={formData.autores || []}
              onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
              label="Autores"
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const autor = autores.find((a) => a.id === id);
                    return autor ? `${autor.nombre} ${autor.apellido}` : "";
                  })
                  .join(", ")
              }
            >
              {autores.map((autor) => (
                <MenuItem key={autor.id} value={autor.id}>
                  <Checkbox checked={formData.autores?.includes(autor.id) || false} />
                  <ListItemText primary={`${autor.nombre} ${autor.apellido}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="activa"
                  checked={formData.activa || false}
                  onChange={(e) =>
                    setFormData({ ...formData, activa: e.target.checked })
                  }
                />
              }
              label="Activo"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="oferta"
                  checked={formData.oferta || false}
                  onChange={(e) =>
                    setFormData({ ...formData, oferta: e.target.checked })
                  }
                />
              }
              label="En oferta"
            />
          </FormGroup>

          {formData.oferta && (
            <TextField
              margin="dense"
              name="descuento"
              label="Descuento (%)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.descuento || 0}
              onChange={handleInputChange}
            />
          )}
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