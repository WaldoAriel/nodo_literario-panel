import { Router } from "express";
import {
  getCarrito,
  createCarrito,
  addItemToCarrito,
  removeItemFromCarrito,
  clearCarrito,
} from "../controllers/carritoControllers.js";

const router = Router();

router.get("/carrito", getCarrito);
router.post("/carrito", createCarrito);
router.post("/carrito/agregar", addItemToCarrito);
router.delete("/carrito/remover", removeItemFromCarrito);
router.delete("/carrito/vaciar", clearCarrito);

export default router;