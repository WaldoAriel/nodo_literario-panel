import { Router } from "express";
import {
  getAllLibros,
  getLibroById,
} from "../controllers/libroControllers.js";  // GETs públicos

const router = Router();

router.get("/libros", getAllLibros);           // GET para Catalogo
router.get("/libros/:id", getLibroById);        // GET para DetalleLibro

export default router;
