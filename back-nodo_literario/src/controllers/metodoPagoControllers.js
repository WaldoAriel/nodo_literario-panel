import { MetodoPago } from "../models/index.js";

// Obtener tooodos los métodos de pago
const getAllMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll();
    res.json(metodos);
  } catch (error) {
    console.error("❌ Error al obtener métodos de pago:", error);
    res.status(500).json({ error: "Error al obtener los métodos de pago" });
  }
};

// Obtener método de pago por ID
const getMetodoPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const metodo = await MetodoPago.findByPk(id);

    if (!metodo) {
      return res.status(404).json({ error: "Método de pago no encontrado" });
    }

    res.json(metodo);
  } catch (error) {
    console.error("❌ Error al obtener método de pago por ID:", error);
    res.status(500).json({ error: "Error al obtener el método de pago" });
  }
};

// Crear un nuevo método de pago
const createMetodoPago = async (req, res) => {
  try {
    const { nombre_metodo, descripcion } = req.body;

    if (!nombre_metodo) {
      return res
        .status(400)
        .json({ error: "El nombre del método es requerido" });
    }

    const nuevoMetodo = await MetodoPago.create({
      nombre_metodo,
      descripcion,
    });

    res.status(201).json(nuevoMetodo);
  } catch (error) {
    console.error("❌ Error al crear método de pago:", error);
    res.status(500).json({ error: "Error al crear el método de pago" });
  }
};

// Actualizar método de pago
const updateMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_metodo, descripcion, activo } = req.body;

    const metodo = await MetodoPago.findByPk(id);

    if (!metodo) {
      return res.status(404).json({ error: "Método de pago no encontrado" });
    }

    if (nombre_metodo !== undefined) metodo.nombre_metodo = nombre_metodo;
    if (descripcion !== undefined) metodo.descripcion = descripcion;
    if (activo !== undefined) metodo.activo = activo;

    await metodo.save();

    res.json(metodo);
  } catch (error) {
    console.error("❌ Error al actualizar método de pago:", error);
    res.status(500).json({ error: "Error al actualizar el método de pago" });
  }
};

// Eliminar método de pago
const deleteMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    const metodo = await MetodoPago.findByPk(id);

    if (!metodo) {
      return res.status(404).json({ error: "Método de pago no encontrado" });
    }

    await metodo.destroy();

    res.json({ message: "Método de pago eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar método de pago:", error);
    res.status(500).json({ error: "Error al eliminar el método de pago" });
  }
};

export {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
};