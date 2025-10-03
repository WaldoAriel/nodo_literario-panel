import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  changePassword,
  getProfile
} from "../controllers/authControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Rutas protegidas (requieren autenticación)
router.get("/profile", authenticateToken, getProfile);
router.put("/change-password", authenticateToken, changePassword);

export default router;