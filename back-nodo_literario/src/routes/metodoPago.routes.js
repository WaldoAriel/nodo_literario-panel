import { Router } from "express";
import {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
} from "../controllers/metodoPagoControllers.js";

const router = Router();

router.get("/api/metodos-pago", getAllMetodosPago);           // GET all
router.get("/api/metodos-pago/:id", getMetodoPagoById);     // GET by ID
router.post("/api/metodos-pago", createMetodoPago);         // POST
router.put("/api/metodos-pago/:id", updateMetodoPago);      // PUT
router.delete("/api/metodos-pago/:id", deleteMetodoPago);   // DELETE

export default router;