import { Router } from "express";
import {
  getAllDirecciones,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion,
} from "../controllers/direccionControllers.js";

const router = Router();

router.get("/api/direcciones", getAllDirecciones); // GET all
router.get("/api/direcciones/:id", getDireccionById); // GET by ID
router.post("/api/direcciones", createDireccion); // POST
router.put("/api/direcciones/:id", updateDireccion); // PUT
router.delete("/api/direcciones/:id", deleteDireccion); // DELETE

export default router;
