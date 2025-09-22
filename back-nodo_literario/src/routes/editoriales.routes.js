import { Router } from "express";
import {
  getAllEditoriales,
  getEditorialById,
  createEditorial,
  updateEditorial,
  deleteEditorial,
} from "../controllers/editorialControllers.js";

const router = Router();

router.get("/editoriales", getAllEditoriales);
router.get("/editoriales/:id", getEditorialById);
router.post("/editoriales", createEditorial);
router.put("/editoriales/:id", updateEditorial);
router.delete("/editoriales/:id", deleteEditorial);

export default router;