import { Router } from "express";
import {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
  uploadImage,
} from "../controllers/libroControllers.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/api/libros", getAllLibros); // GET all
router.get("/api/libros/:id", getLibroById); // GET by ID
router.post("/api/libros", createLibro); // POST
router.put("/api/libros/:id", updateLibro); // PUT
router.delete("/api/libros/:id", deleteLibro); // DELETE
router.post("/api/libros/upload", upload.single("imagen"), uploadImage); // para subir las imágenes

export default router;
