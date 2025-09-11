import { Pedido, Cliente, Direccion } from "../models/index.js";

// Obtener todos los pedidos (opcionalmente filtrados por cliente)
const getAllPedidos = async (req, res) => {
  try {
    const { id_cliente } = req.query;

    const whereClause = {};

    if (id_cliente) {
      whereClause.id_cliente = id_cliente;
    }

    const pedidos = await Pedido.findAll({
      where: whereClause,
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Direccion,
          as: "direccion",
          attributes: ["calle", "ciudad", "codigo_postal", "pais"],
        },
      ],
    });

    res.json(pedidos);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

// Obtener pedido por ID
const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["nombre", "apellido", "email"],
        },
        {
          model: Direccion,
          as: "direccion",
          attributes: ["calle", "ciudad", "codigo_postal", "pais"],
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    console.error("❌ Error al obtener pedido por ID:", error);
    res.status(500).json({ error: "Error al obtener el pedido" });
  }
};

// Crear un nuevo pedido
const createPedido = async (req, res) => {
  try {
    const { id_cliente, id_direccion, total, estado_pedido } = req.body;

    if (!id_cliente || !id_direccion || total === undefined) {
      return res.status(400).json({
        error: "Se requieren id_cliente, id_direccion y total",
      });
    }

    const nuevoPedido = await Pedido.create({
      id_cliente,
      id_direccion,
      total,
      estado_pedido: estado_pedido || "pendiente",
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error("❌ Error al crear pedido:", error);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
};

// Actualizar estado del pedido
const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_pedido } = req.body;

    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (estado_pedido !== undefined) {
      pedido.estado_pedido = estado_pedido;
    }

    await pedido.save();

    res.json(pedido);
  } catch (error) {
    console.error("❌ Error al actualizar pedido:", error);
    res.status(500).json({ error: "Error al actualizar el pedido" });
  }
};

// Eliminar pedido (eliminación lógica o física)
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Eliminación lógica (si usas campo como `activo`)
    // pedido.activo = false;
    // await pedido.save();

    // Eliminación física
    await pedido.destroy();

    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
};

export {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
};