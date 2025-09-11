import { Router } from "express";
import {
  getMensajesByLibroId,
  createMensaje,
} from "../controllers/mensajeControllers.js";

const router = Router();

router.get("/api/libros/:libroId/mensajes", getMensajesByLibroId); // GET by ID del prod
router.post("/api/libros/:libroId/mensajes", createMensaje); // POST

export default router;
