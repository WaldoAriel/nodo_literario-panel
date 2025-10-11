// auth.routes.js - MODIFICADO
import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  changePassword,
  getProfile,
  googleAuth,
  googleCallback
} from "../controllers/authControllers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// NUEVAS RUTAS OAUTH
router.get("/google", googleAuth);
router.post("/google/callback", googleCallback);

// Rutas protegidas (requieren autenticación)
router.get("/profile", authenticateToken, getProfile);
router.put("/change-password", authenticateToken, changePassword);

export default router;