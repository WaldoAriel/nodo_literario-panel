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
router.get("/autores", getAllAutores); // Obtener todos los autores
router.get("/autores/:id", getAutorById); // Obtener un autor por ID
router.post("/autores", createAutor); // Crear un nuevo autor
router.put("/autores/:id", updateAutor); // Actualizar un autor por ID
router.delete("/autores/:id", deleteAutor); // Eliminar un autor por ID

export default router;