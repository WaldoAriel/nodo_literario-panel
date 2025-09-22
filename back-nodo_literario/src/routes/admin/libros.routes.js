import { Router } from "express";
import {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
  uploadImage,
} from "../../controllers/libroControllers.js";

import upload from "../../middleware/upload.js"; // multer

const router = Router();

router.get("/", getAllLibros);
router.get("/:id", getLibroById);
router.post("/", createLibro);
router.put("/:id", updateLibro);
router.delete("/:id", deleteLibro);

// ruta para subir imágenes
router.post("/upload", upload.single('imagen'), uploadImage);

export default router;
