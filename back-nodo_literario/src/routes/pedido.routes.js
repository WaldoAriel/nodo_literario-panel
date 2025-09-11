import { Router } from "express";
import {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidoControllers.js";

const router = Router();

router.get("/api/pedidos", getAllPedidos);            // GET all
router.get("/api/pedidos/:id", getPedidoById);        // GET by ID
router.post("/api/pedidos", createPedido);            // POST
router.put("/api/pedidos/:id", updatePedido);         // PUT
router.delete("/api/pedidos/:id", deletePedido);      // DELETE

export default router;