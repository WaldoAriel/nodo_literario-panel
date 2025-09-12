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
  Snackbar,
  Alert,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Función para mostrar mensajes
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Cargar libros
  const cargarLibros = async (page = 1) => {
    setLoading(true);
    try {
      const response = await libroService.getLibros(page, 4);
      setLibros(response.data.libros);
      setTotalPaginas(response.data.pagination.totalPages);
      setPaginaActual(page);
    } catch (error) {
      console.error("Error cargando libros:", error);
      showSnackbar("Error al cargar los libros", "error");
      setLibros([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos para los selects
  const cargarDatosRelaciones = async () => {
    try {
      console.log("🔍 DEBUG: Intentando cargar relaciones...");

      const [catResponse, editResponse, autResponse] = await Promise.all([
        relacionesService.getCategorias(),
        relacionesService.getEditoriales(),
        relacionesService.getAutores(),
      ]);

      // VERIFICAR TODAS LAS POSIBLES ESTRUCTURAS
      const categoriasData =
        catResponse.data?.categorias ||
        catResponse.data?.data ||
        catResponse.data;
      const editorialesData =
        editResponse.data?.editoriales ||
        editResponse.data?.data ||
        editResponse.data;
      const autoresData =
        autResponse.data?.autores || autResponse.data?.data || autResponse.data;

      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setEditoriales(Array.isArray(editorialesData) ? editorialesData : []);
      setAutores(Array.isArray(autoresData) ? autoresData : []);
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
    setFormData((prev) => ({
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
        autores: libro.autores ? libro.autores.map((a) => a.id) : [],
        activa: libro.activa || true,
        oferta: libro.oferta || false,
        descuento: libro.descuento || 0,
        imagenUrl:
          libro.imagen ||
          (libro.imagenes && libro.imagenes[0]?.urlImagen) ||
          "",
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
    if (!formData.titulo.trim()) {
      showSnackbar("El título es requerido", "error");
      return;
    }
    if (!formData.id_categoria) {
      showSnackbar("Debe seleccionar una categoría", "error");
      return;
    }

    setSaving(true);
    try {
      const libroData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        descuento: formData.oferta ? parseFloat(formData.descuento) : 0,
        imagenUrl: formData.imagenUrl,
      };

      if (currentLibro) {
        await libroService.updateLibro(currentLibro.id, libroData);
        showSnackbar("Libro actualizado correctamente");
      } else {
        await libroService.createLibro(libroData);
        showSnackbar("Libro creado correctamente");
      }

      cargarLibros(paginaActual);
      handleCloseModal();
    } catch (error) {
      console.error("Error guardando libro:", error);
      showSnackbar("Error al guardar el libro", "error");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar libro
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este libro?")) {
      try {
        await libroService.deleteLibro(id);
        cargarLibros(paginaActual);
        showSnackbar("Libro eliminado correctamente");
      } catch (error) {
        console.error("Error eliminando libro:", error);
        showSnackbar("Error al eliminar el libro", "error");
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
                  <TableCell>
                    {libro.categoria?.nombre || "Sin categoría"}
                  </TableCell>
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

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
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
            name="imagenUrl"
            label="URL de la imagen"
            fullWidth
            variant="outlined"
            value={formData.imagenUrl || ""}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            helperText="Pega la URL de la imagen del libro"
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
              onChange={(e) => {
                console.log("Autores seleccionados:", e.target.value); // DEBUUUGGG
                setFormData({ ...formData, autores: e.target.value });
              }}
              label="Autores"
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const autor = autores.find((a) => a.id === id);
                    return autor ? `${autor.nombre} ${autor.apellido}` : "";
                  })
                  .join(", ")
              }
              onClose={() => console.log("Select cerrado")} // DEBUUUGGG
            >
              {autores.map((autor) => (
                <MenuItem key={autor.id} value={autor.id}>
                  <Checkbox
                    checked={formData.autores?.includes(autor.id) || false}
                  />
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
