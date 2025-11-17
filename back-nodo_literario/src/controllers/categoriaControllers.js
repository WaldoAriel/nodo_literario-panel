import { Categoria } from "../models/index.js";

// trae todas las categorías con paginación
const getAllCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Convierte a números y calcula offset
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // findAndCountAll trae datos + total count
    const { count, rows: categorias } = await Categoria.findAndCountAll({
      limit: limitNumber,
      offset: offset,
      order: [['id', 'ASC']] // Ordena por ID ascendente
    });

    // Respuesta paginada
    res.json({
      categorias,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        itemsPerPage: limitNumber
      }
    });

  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Trae categoría por id
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener la categoría", error);
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

// Crea una categoría nueva
const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevaCategoria = await Categoria.create({ nombre });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

// Actualiza la categoría
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    if (nombre !== undefined) categoria.nombre = nombre;

    await categoria.save();
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

// Elimina la categoría
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoria.destroy();
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};

export { getAllCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };