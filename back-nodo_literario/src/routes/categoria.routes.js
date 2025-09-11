import { Router } from "express";
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoriaControllers.js";

const router = Router();

router.get("/api/categorias", getAllCategorias); // GET all
router.get("/api/categorias/:id", getCategoriaById); // GET by ID
router.post("/api/categorias", createCategoria); // POST
router.put("/api/categorias/:id", updateCategoria); // PUT
router.delete("/api/categorias/:id", deleteCategoria); // DELETE

export default router;
