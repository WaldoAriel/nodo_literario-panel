import { Router } from "express";
import {
 getAllLibros,
 getLibroById,
 createLibro,
 updateLibro,
 deleteLibro,
} from "../../controllers/libroControllers.js";

import upload from "../../middleware/upload.js"; // multer

const router = Router();

router.get("/", getAllLibros);
router.get("/:id", getLibroById);

// 💡 Nueva ruta: Ahora `createLibro` procesa las imágenes directamente.
router.post("/", upload.array("imagenes", 5), createLibro);

// 💡 Nueva ruta: También `updateLibro` puede recibir nuevas imágenes.
router.put("/:id", upload.array("imagenes", 5), updateLibro);

router.delete("/:id", deleteLibro);

// ❌ Eliminamos la ruta de subida de imágenes separada.
// router.post("/upload", upload.single('imagen'), uploadImage);

export default router;
