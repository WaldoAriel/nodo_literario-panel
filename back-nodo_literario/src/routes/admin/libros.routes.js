import { Router } from "express";
import {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from "../../controllers/libroControllers.js";

const router = Router();

// Todas las rutas empiezan con /api/admin/libros

router.get("/", getAllLibros);           // GET /api/admin/libros
router.get("/:id", getLibroById);        // GET /api/admin/libros/1
router.post("/", createLibro);           // POST /api/admin/libros
router.put("/:id", updateLibro);         // PUT /api/admin/libros/1
router.delete("/:id", deleteLibro);      // DELETE /api/admin/libros/1

export default router;