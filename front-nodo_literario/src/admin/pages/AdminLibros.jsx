import React, { useState, useEffect, useRef } from "react";
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
  DialogContentText,
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
  Chip,
  Avatar,
  Box as MuiBox,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  CloudUpload,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

// Integración de libroService.js
const libroService = {
  getLibros: (page = 1, limit = 10) =>
    axios.get(
      `http://localhost:3000/api/admin/libros?page=${page}&limit=${limit}`
    ),
  createLibro: (libroData) =>
    axios.post(`http://localhost:3000/api/admin/libros`, libroData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateLibro: (id, libroData) =>
    axios.put(`http://localhost:3000/api/admin/libros/${id}`, libroData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteLibro: (id) =>
    axios.delete(`http://localhost:3000/api/admin/libros/${id}`),
  getLibroById: (id) =>
    axios.get(`http://localhost:3000/api/admin/libros/${id}`),
};

// Integración de relacionesService.js
const relacionesService = {
  getCategorias: () => axios.get(`http://localhost:3000/api/categorias`),
  getEditoriales: () => axios.get(`http://localhost:3000/api/editoriales`),
  getAutores: () => axios.get(`http://localhost:3000/api/autores`),
};

// Integración de ImageUploader.jsx
const ImageUploader = ({ onImageSelect, existingImages = [] }) => {
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingImages.length > 0) {
      setPreviews(
        existingImages.map((img) =>
          typeof img === "string" ? img : URL.createObjectURL(img)
        )
      );
    } else {
      setPreviews([]);
    }
  }, [existingImages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews(newPreviews);
    onImageSelect(files);
  };

  const handleRemoveImage = (indexToRemove) => {
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(newPreviews);
    onImageSelect(existingImages.filter((_, index) => index !== indexToRemove));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <MuiBox sx={{ mb: 2 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
        id="image-upload"
      />

      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          {previews.length > 0 ? "Cambiar imágenes" : "Seleccionar imágenes"}
        </Button>
      </label>

      {previews.length > 0 && (
        <MuiBox sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {previews.map((previewUrl, index) => (
            <MuiBox key={index} sx={{ position: "relative" }}>
              <img
                src={previewUrl}
                alt={`Vista previa ${index + 1}`}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  backgroundColor: "white",
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </MuiBox>
          ))}
        </MuiBox>
      )}
    </MuiBox>
  );
};

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
    imageFiles: [],
    imagesToRemove: [],
  });
  // ESTADOS PARA CONFIRMACIÓN DE DELETE
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    libroId: null,
    libroTitulo: "",
  });

  const handleRemoveExistingImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== imageUrl),
      imagesToRemove: [...prev.imagesToRemove, imageUrl],
    }));
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const cargarLibros = async (page = 1) => {
    setLoading(true);
    try {
      const response = await libroService.getLibros(page, 4);

      console.log("📚 Datos de libros recibidos:", response.data.libros); // DEBUG

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

  const cargarDatosRelaciones = async () => {
    try {
      const [catResponse, editResponse, autResponse] = await Promise.all([
        relacionesService.getCategorias(),
        relacionesService.getEditoriales(),
        relacionesService.getAutores(),
      ]);

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

  const handleImageSelect = (files) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: files,
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
        imageFiles: [],
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
        imageFiles: [],
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLibro(null);
  };

  const handleSave = async () => {
    if (formData.imagesToRemove && formData.imagesToRemove.length > 0) {
      formData.imagesToRemove.forEach((url) => {
        libroData.append("imagesToRemove[]", url);
      });
    }
    if (!formData.titulo.trim()) {
      showSnackbar("El título es requerido", "error");
      return;
    }
    if (!formData.id_categoria) {
      showSnackbar("Debe seleccionar una categoría", "error");
      return;
    }
    if (!currentLibro && formData.imageFiles.length === 0) {
      showSnackbar("Debe seleccionar al menos una imagen", "error");
      return;
    }

    setSaving(true);

    const libroData = new FormData();

    libroData.append("titulo", formData.titulo);
    libroData.append("isbn", formData.isbn);
    libroData.append("descripcion", formData.descripcion);
    libroData.append("precio", parseFloat(formData.precio));
    libroData.append("stock", parseInt(formData.stock));
    libroData.append("id_categoria", formData.id_categoria);
    libroData.append("id_editorial", formData.id_editorial);
    libroData.append("activa", formData.activa);
    libroData.append("oferta", formData.oferta);
    libroData.append(
      "descuento",
      formData.oferta ? parseFloat(formData.descuento) : 0
    );
    formData.autores.forEach((autorId) => {
      libroData.append("autores[]", autorId);
    });

    formData.imageFiles.forEach((file) => {
      libroData.append("imagenes", file);
    });

    try {
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

  // 👇 NUEVA FUNCIÓN: Abrir diálogo de confirmación
  const handleDeleteClick = (libro) => {
    setDeleteDialog({
      open: true,
      libroId: libro.id,
      libroTitulo: libro.titulo,
    });
  };

  // 👇 FUNCIÓN ACTUAL MODIFICADA: Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      await libroService.deleteLibro(deleteDialog.libroId);
      showSnackbar(`"${deleteDialog.libroTitulo}" eliminado correctamente`);
      cargarLibros(paginaActual);
    } catch (error) {
      console.error("Error eliminando libro:", error);
      showSnackbar("Error al eliminar el libro", "error");
    } finally {
      // Cerrar el diálogo sin importar el resultado
      setDeleteDialog({
        open: false,
        libroId: null,
        libroTitulo: "",
      });
    }
  };

  // 👇 FUNCIÓN: Cancelar eliminación
  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      libroId: null,
      libroTitulo: "",
    });
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
              <TableCell>Portada</TableCell>
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
                  {/* 👇 NUEVA CELDA CON LA IMAGEN */}
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={
                        libro.imagenes && libro.imagenes.length > 0
                          ? libro.imagenes[0].urlImagen
                          : ""
                      }
                      sx={{
                        width: 60,
                        height: 80,
                        bgcolor: "grey.300",
                      }}
                    >
                      📚
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {libro.titulo}
                    </Typography>
                    {libro.oferta && (
                      <Chip
                        label="OFERTA"
                        size="small"
                        color="secondary"
                        sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    {libro.autores && libro.autores.length > 0
                      ? libro.autores
                          .map((autor) => `${autor.nombre} ${autor.apellido}`)
                          .join(", ")
                      : "Sin autor"}
                  </TableCell>

                  <TableCell align="right">
                    <Box>
                      {libro.oferta ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                              fontSize: "0.8rem",
                            }}
                          >
                            ${libro.precio}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="error.main"
                            fontWeight="bold"
                          >
                            $
                            {(
                              libro.precio *
                              (1 - (libro.descuento || 0) / 100)
                            ).toFixed(2)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body1" fontWeight="medium">
                          ${libro.precio}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Chip
                      label={libro.stock}
                      size="small"
                      color={
                        libro.stock > 10
                          ? "success"
                          : libro.stock > 0
                          ? "warning"
                          : "error"
                      }
                      variant={libro.stock === 0 ? "outlined" : "filled"}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={libro.categoria?.nombre || "Sin categoría"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      onClick={() => handleOpenModal(libro)}
                      size="small"
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(libro)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
          <ImageUploader
            onImageSelect={handleImageSelect}
            onRemoveExisting={handleRemoveExistingImage}
            existingImages={formData.existingImages || []}
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
              value={formData.autores || []}
              onChange={(e) => {
                const value = Array.isArray(e.target.value)
                  ? e.target.value
                  : [e.target.value];
                setFormData({ ...formData, autores: value });
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
            >
              {autores.map((autor) => (
                <MenuItem key={autor.id} value={autor.id}>
                  <Checkbox checked={formData.autores?.includes(autor.id)} />
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
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 👇 DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "error.main", fontWeight: "bold" }}
        >
          🗑️ Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar el libro
            <Typography
              component="span"
              fontWeight="bold"
              color="primary"
              sx={{ mx: 1 }}
            >
              "{deleteDialog.libroTitulo}"
            </Typography>
            ?
          </DialogContentText>
          <DialogContentText
            sx={{ mt: 2, color: "warning.main", fontStyle: "italic" }}
          >
            ⚠️ Esta acción no se puede deshacer. El libro se marcará como
            inactivo.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderColor: "grey.400",
              "&:hover": {
                borderColor: "grey.600",
                backgroundColor: "grey.50",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              backgroundColor: "error.main",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            Sí, Eliminar
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
