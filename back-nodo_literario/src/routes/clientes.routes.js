import { Router } from "express";
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/clienteControllers.js";

const router = Router();

router.get("/api/clientes", getAllClientes);        // GET all
router.get("/api/clientes/:id", getClienteById);    // GET by ID
router.post("/api/clientes", createCliente);        // POST
router.put("/api/clientes/:id", updateCliente);     // PUT
router.delete("/api/clientes/:id", deleteCliente);  // DELETE

export default router;