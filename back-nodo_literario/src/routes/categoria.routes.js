import { Router } from "express";
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/categoriaControllers.js";

const router = Router();

router.get("/categorias", getAllCategorias); // GET all
router.get("/categorias/:id", getCategoriaById); // GET by ID
router.post("/categorias", createCategoria); // POST
router.put("/categorias/:id", updateCategoria); // PUT
router.delete("/categorias/:id", deleteCategoria); // DELETE

export default router;
