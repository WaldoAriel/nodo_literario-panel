import { Cliente } from "../models/index.js";

// Obtener todos los clientes activos
const getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

// Obtener cliente por ID
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    console.error("❌ Error al obtener cliente por ID:", error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        error: "Los campos nombre, apellido y email son obligatorios",
      });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      email,
      telefono,
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

// Actualizar cliente
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    if (nombre !== undefined) cliente.nombre = nombre;
    if (apellido !== undefined) cliente.apellido = apellido;
    if (email !== undefined) cliente.email = email;
    if (telefono !== undefined) cliente.telefono = telefono;

    await cliente.save();

    res.json(cliente);
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

// Eliminar cliente (eliminación lógica o física)
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Eliminación lógica (si usas campo como `activo`)
    // cliente.activo = false;
    // await cliente.save();

    // Eliminación física (por ahora lo dejamos así)
    await cliente.destroy();

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

export {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};