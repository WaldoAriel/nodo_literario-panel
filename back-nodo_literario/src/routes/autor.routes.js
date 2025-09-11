import { Router } from "express";
import {
  getAllAutores,
  getAutorById,
  createAutor,
  updateAutor,
  deleteAutor,
} from "../controllers/autorControllers.js"; // Importa las funciones del controlador

const router = Router();

// Rutas para Autores
router.get("/api/autores", getAllAutores); // Obtener todos los autores
router.get("/api/autores/:id", getAutorById); // Obtener un autor por ID
router.post("/api/autores", createAutor); // Crear un nuevo autor
router.put("/api/autores/:id", updateAutor); // Actualizar un autor por ID
router.delete("/api/autores/:id", deleteAutor); // Eliminar un autor por ID

export default router;