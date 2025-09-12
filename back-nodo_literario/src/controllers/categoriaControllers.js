import { Categoria } from "../models/index.js";

// Obtener todas las categorías con paginación
const getAllCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Convertir a números y calcular offset
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // Usar findAndCountAll para obtener datos + total count
    const { count, rows: categorias } = await Categoria.findAndCountAll({
      limit: limitNumber,
      offset: offset,
      order: [['id', 'ASC']] // Ordenar por ID ascendente
    });

    // Devolver respuesta paginada
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

// Obtener categoría por id
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

// Crear una categoría nueva
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

// Actualizar categoría
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

// Eliminar categoría
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