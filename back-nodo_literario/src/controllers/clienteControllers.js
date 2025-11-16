import { Cliente, Usuario } from "../models/index.js";

// Obtener todos los clientes activos
const getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['nombre', 'apellido', 'email', 'telefono']
      }]
    });
    
    // Transformar la respuesta para mantener compatibilidad
    const clientesTransformados = clientes.map(cliente => ({
      id: cliente.id,
      id_usuario: cliente.id_usuario,
      nombre: cliente.usuario.nombre,
      apellido: cliente.usuario.apellido,
      email: cliente.usuario.email,
      telefono: cliente.usuario.telefono,
      fecha_registro: cliente.fecha_registro,
      tipo_cliente: cliente.tipo_cliente
    }));
    
    res.json(clientesTransformados);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
};

// Obtener cliente por ID
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['nombre', 'apellido', 'email', 'telefono']
      }]
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Transformar respuesta
    const clienteTransformado = {
      id: cliente.id,
      id_usuario: cliente.id_usuario,
      nombre: cliente.usuario.nombre,
      apellido: cliente.usuario.apellido,
      email: cliente.usuario.email,
      telefono: cliente.usuario.telefono,
      fecha_registro: cliente.fecha_registro,
      tipo_cliente: cliente.tipo_cliente
    };

    res.json(clienteTransformado);
  } catch (error) {
    console.error("❌ Error al obtener cliente por ID:", error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
  try {
    return res.status(400).json({ 
      error: "Los clientes se crean mediante el sistema de registro de usuarios" 
    });
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

    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Actualizar en la tabla USUARIO
    if (nombre !== undefined) cliente.usuario.nombre = nombre;
    if (apellido !== undefined) cliente.usuario.apellido = apellido;
    if (email !== undefined) cliente.usuario.email = email;
    if (telefono !== undefined) cliente.usuario.telefono = telefono;

    await cliente.usuario.save();

    // Devolver datos
    const clienteActualizado = {
      id: cliente.id,
      id_usuario: cliente.id_usuario,
      nombre: cliente.usuario.nombre,
      apellido: cliente.usuario.apellido,
      email: cliente.usuario.email,
      telefono: cliente.usuario.telefono,
      fecha_registro: cliente.fecha_registro,
      tipo_cliente: cliente.tipo_cliente
    };

    res.json(clienteActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

// Eliminar cliente 
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Eliminación lógica de USUARIO
    cliente.usuario.activo = false;
    await cliente.usuario.save();

    res.json({ message: "Cliente desactivado correctamente" });
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