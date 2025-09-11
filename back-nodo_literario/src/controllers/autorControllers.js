import { Autor, Libro } from "../models/index.js";

// lista de autores
const getAllAutores = async (req, res) => {
  try {
    const autores = await Autor.findAll();
    res.json(autores);
  } catch (error) {
    console.error("Error al obtener los autores", error);
    res.status(500).json({ Error: "error al obtener la lista de autores" });
  }
};

// autor por id

const getAutorById = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);

    if (!autor) {
      return res.status(404).json({ error: "No se encuentra el autor" });
    }
    res.json(autor);
  } catch (error) {
    console.error("error al obtener el autor por ID");
    res.status(500).json({ error: "No pudimos obtener el autor" });
  }
};

// crear Autor

const createAutor = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      biografia,
      fechaNacimiento,
      nacionalidad,
      activo,
    } = req.body;

    if (!nombre || !apellido) {
      return res
        .status(400)
        .json({ error: "Nombre y Apellido son campos obligatorios" });
    }

    const nuevoAutor = await Autor.create({
      nombre,
      apellido,
      biografia,
      fechaNacimiento,
      nacionalidad,
      activo,
    });
    res.status(201).json(nuevoAutor);
  } catch (error) {
    console.error("Error al crear el autor", error);
    res.status(500).json({ error: "Error al intentar crear el autor" });
  }
};

// actualizar autor

const updateAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      biografia,
      fechaNacimiento,
      nacionalidad,
      activo,
    } = req.body;
    const autor = await Autor.findByPk(id);
    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }

    if (nombre !== undefined) autor.nombre = nombre;
    if (apellido !== undefined) autor.apellido = apellido;
    if (biografia !== undefined) autor.biografia = biografia;
    if (fechaNacimiento !== undefined) autor.fechaNacimiento = fechaNacimiento;
    if (nacionalidad !== undefined) autor.nacionalidad = nacionalidad;
    if (activo !== undefined) autor.activo = activo;

    await autor.save();
    res.json(autor);
  } catch (error) {
    console.error("❌ Error al actualizar autor:", error);
    res.status(500).json({ error: "Error al actualizar el autor" });
  }
};

// eliminar autor

const deleteAutor = async (req, res) => {
  try {
    const { id } = req.params;
    const autor = await Autor.findByPk(id);
    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    await autor.destroy()
    res.json({message: "Autor eliminado de la base de datos"})
  } catch (error) {
    console.error("Error al eliminar el autor", error);
    res.status(500).json({error:"No se pudo eliminar el autor de nuestra base de datos"})
  }
};

export {
  getAllAutores,
  getAutorById,
  createAutor,
  updateAutor,
  deleteAutor,
}; 