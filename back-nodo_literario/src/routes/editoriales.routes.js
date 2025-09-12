import { Router } from "express";
import {
  getAllEditoriales,
  getEditorialById,
  createEditorial,
  updateEditorial,
  deleteEditorial,
} from "../controllers/editorialControllers.js";

const router = Router();

router.get("/api/editoriales", getAllEditoriales);
router.get("/api/editoriales/:id", getEditorialById);
router.post("/api/editoriales", createEditorial);
router.put("/api/editoriales/:id", updateEditorial);
router.delete("/api/editoriales/:id", deleteEditorial);

export default router;