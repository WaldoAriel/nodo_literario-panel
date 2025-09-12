import { Editorial } from "../models/index.js";

// Obtener todas las editoriales con paginación
const getAllEditoriales = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows: editoriales } = await Editorial.findAndCountAll({
      limit: limitNumber,
      offset: offset,
      order: [['id', 'ASC']]
    });

    res.json({
      editoriales,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        itemsPerPage: limitNumber
      }
    });

  } catch (error) {
    console.error("❌ Error al obtener editoriales:", error);
    res.status(500).json({ error: "Error al obtener las editoriales" });
  }
};

// Obtener editorial por id
const getEditorialById = async (req, res) => {
  try {
    const { id } = req.params;
    const editorial = await Editorial.findByPk(id);
    
    if (!editorial) {
      return res.status(404).json({ error: "Editorial no encontrada" });
    }
    
    res.json(editorial);
  } catch (error) {
    console.error("Error al obtener la editorial", error);
    res.status(500).json({ error: "Error al obtener la editorial" });
  }
};

// Crear una editorial nueva
const createEditorial = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevaEditorial = await Editorial.create({ nombre });
    res.status(201).json(nuevaEditorial);
  } catch (error) {
    console.error("❌ Error al crear editorial:", error);
    res.status(500).json({ error: "Error al crear la editorial" });
  }
};

// Actualizar editorial
const updateEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const editorial = await Editorial.findByPk(id);

    if (!editorial) {
      return res.status(404).json({ error: "Editorial no encontrada" });
    }

    if (nombre !== undefined) editorial.nombre = nombre;

    await editorial.save();
    res.json(editorial);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la editorial" });
  }
};

// Eliminar editorial
const deleteEditorial = async (req, res) => {
  try {
    const { id } = req.params;
    const editorial = await Editorial.findByPk(id);

    if (!editorial) {
      return res.status(404).json({ error: "Editorial no encontrada" });
    }

    await editorial.destroy();
    res.json({ message: "Editorial eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la editorial" });
  }
};

export { getAllEditoriales, getEditorialById, createEditorial, updateEditorial, deleteEditorial };