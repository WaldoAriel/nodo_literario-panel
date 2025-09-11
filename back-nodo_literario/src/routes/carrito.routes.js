import { Router } from "express";
import {
  getCarrito,
  createCarrito,
  addItemToCarrito,
  removeItemFromCarrito,
  clearCarrito,
} from "../controllers/carritoControllers.js";

const router = Router();

router.get("/api/carrito", getCarrito);
router.post("/api/carrito", createCarrito);
router.post("/api/carrito/agregar", addItemToCarrito);
router.delete("/api/carrito/remover", removeItemFromCarrito);
router.delete("/api/carrito/vaciar", clearCarrito);

export default router;