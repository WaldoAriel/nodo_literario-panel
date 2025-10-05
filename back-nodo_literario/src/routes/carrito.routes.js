import { Router } from "express";
import {
  getCarrito,
  createCarrito,
  addItemToCarrito,
  removeItemFromCarrito,
  clearCarrito,
} from "../controllers/carritoControllers.js";

const router = Router();

router.get("/", getCarrito);           // GET /api/carrito
router.post("/", createCarrito);       // POST /api/carrito
router.post("/agregar", addItemToCarrito);     // POST /api/carrito/agregar
router.delete("/remover", removeItemFromCarrito); // DELETE /api/carrito/remover
router.delete("/vaciar", clearCarrito);        // DELETE /api/carrito/vaciar

export default router;