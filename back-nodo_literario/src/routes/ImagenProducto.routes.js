import { Router } from "express";
import {
  getAllImagenes,
  getImagenesById,
  createImagenProd,
} from "../controllers/imagenProductoControllers.js";

const router = Router();

router.get("/api/libros/:libroId/imagenes", getAllImagenes);
router.get("/api/imagenes/:id", getImagenesById)
router.post("/api/libros/:libroId/imagenes", createImagenProd);

export default router;
