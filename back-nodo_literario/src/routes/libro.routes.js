import { Router } from "express";
import {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from "../controllers/libroControllers.js";

const router = Router();

router.get("/api/libros", getAllLibros); // GET all
router.get("/api/libros/:id", getLibroById); // GET by ID
router.post("/api/libros", createLibro); // POST
router.put("/api/libros/:id", updateLibro); // PUT
router.delete("/api/libros/:id", deleteLibro); // DELETE




export default router;
