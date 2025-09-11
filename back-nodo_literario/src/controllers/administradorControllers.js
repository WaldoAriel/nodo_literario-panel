import { Administrador, Usuario } from "../models/index.js";

// Obtener tooodos los administradores
const getAllAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nombre", "apellido", "email"],
        },
      ],
    });
    res.json(administradores);
  } catch (error) {
    console.error("❌ Error al obtener administradores:", error);
    res.status(500).json({ error: "Error al obtener los administradores" });
  }
};

// Obtener administrador por ID
const getAdministradorById = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nombre", "apellido", "email"],
        },
      ],
    });

    if (!administrador) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    res.json(administrador);
  } catch (error) {
    console.error("❌ Error al obtener administrador por ID:", error);
    res.status(500).json({ error: "Error al obtener el administrador" });
  }
};

// Crear un nuevo administrador
const createAdministrador = async (req, res) => {
  try {
    const { id_usuario, rol } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: "El id_usuario es obligatorio" });
    }

    // verificar si ya existe como administrador
    const existeAdmin = await Administrador.findOne({
      where: { id_usuario },
    });

    if (existeAdmin) {
      return res
        .status(400)
        .json({ error: "Este usuario ya es administrador" });
    }

    const nuevoAdministrador = await Administrador.create({
      id_usuario,
      rol: rol || "gestor_inventario",
    });

    res.status(201).json(nuevoAdministrador);
  } catch (error) {
    console.error("❌ Error al crear administrador:", error);
    res.status(500).json({ error: "Error al crear el administrador" });
  }
};

// Actualizar rol de administrador
const updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    if (rol !== undefined) administrador.rol = rol;

    await administrador.save();

    res.json(administrador);
  } catch (error) {
    console.error("❌ Error al actualizar administrador:", error);
    res.status(500).json({ error: "Error al actualizar el administrador" });
  }
};

// Eliminar administrador
const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }

    await administrador.destroy();

    res.json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar administrador:", error);
    res.status(500).json({ error: "Error al eliminar el administrador" });
  }
};

export {
  getAllAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
};
