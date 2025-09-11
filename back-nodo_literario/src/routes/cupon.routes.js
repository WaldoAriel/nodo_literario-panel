import { Router } from "express";
import {
  getAllCupones,
  getCuponById,
  createCupon,
  updateCupon,
  deleteCupon,
} from "../controllers/cuponControllers.js";

const router = Router();

router.get("/api/cupones", getAllCupones); // GET all
router.get('/api/cupones/validar/:codigo') // validar
router.get("/api/cupones/:id", getCuponById); // GET by ID
router.post("/api/cupones", createCupon); // POST
router.put("/api/cupones/:id", updateCupon); // PUT
router.delete("/api/cupones/:id", deleteCupon); // DELETE

export default router;
