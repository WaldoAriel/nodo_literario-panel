import { Router } from "express";
import { adminLogin } from "../../controllers/adminAuthControllers.js";

const router = Router();

// Ruta para login de administradores
router.post("/login", adminLogin);

export default router;