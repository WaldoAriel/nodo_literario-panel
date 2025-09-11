import { Router } from "express";
import {
  getAllAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
} from "../controllers/administradorControllers.js";

const router = Router();

router.get("/api/administradores", getAllAdministradores);         // GET all
router.get("/api/administradores/:id", getAdministradorById);     // GET by ID
router.post("/api/administradores", createAdministrador);         // POST
router.put("/api/administradores/:id", updateAdministrador);      // PUT
router.delete("/api/administradores/:id", deleteAdministrador);    // DELETE

export default router;