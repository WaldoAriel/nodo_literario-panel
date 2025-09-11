import { Router } from "express";
import {
  getAllDetallesPedido,
  getDetallePedidoById,
  createDetallePedido,
  updateDetallePedido,
  deleteDetallePedido,
} from "../controllers/detallePedidoControllers.js";

const router = Router();

router.get("/api/detalles-pedido", getAllDetallesPedido);           // GET all
router.get("/api/detalles-pedido/:id", getDetallePedidoById);     // GET by ID
router.post("/api/detalles-pedido", createDetallePedido);         // POST
router.put("/api/detalles-pedido/:id", updateDetallePedido);       // PUT
router.delete("/api/detalles-pedido/:id", deleteDetallePedido);    // DELETE

export default router;