import { Autor } from "../models/index.js";

// trae todos los autores con paginación
const getAllAutores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      sortBy = "apellido",
      sortDirection = "asc",
    } = req.query;

    // Convierte a números y calcula offset
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // recibe y aplica los parámetros de ordenamiento
    const order = [[sortBy, sortDirection.toUpperCase()]];

    // findAndCountAll para obtener datos + total count
    const { count, rows: autores } = await Autor.findAndCountAll({
      limit: limitNumber,
      offset: offset,
      order: order,
    });

    // respuesta paginada
    res.json({
      autores,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("❌ Error al obtener autores:", error);
    res.status(500).json({ error: "Error al obtener los autores" });
  }
};
// Trae autor por id
const getAutorById = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    res.json(autor);
  } catch (error) {
    console.error("Error al obtener el autor", error);
    res.status(500).json({ error: "Error al obtener el autor" });
  }
};

// Crea un autor nuevo
const createAutor = async (req, res) => {
  try {
    const { nombre, apellido } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevoAutor = await Autor.create({
      nombre,
      apellido: apellido || null,
    });

    res.status(201).json(nuevoAutor);
  } catch (error) {
    console.error("❌ Error al crear autor:", error);
    res.status(500).json({ error: "Error al crear el autor" });
  }
};

// Actualiza el autor
const updateAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido } = req.body;

    const autor = await Autor.findByPk(id);

    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    if (nombre !== undefined) autor.nombre = nombre;
    if (apellido !== undefined) autor.apellido = apellido;

    await autor.save();
    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el autor" });
  }
};

// Elimina el autor
const deleteAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    await autor.destroy();
    res.json({ message: "Autor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el autor" });
  }
};

export { getAllAutores, getAutorById, createAutor, updateAutor, deleteAutor };
