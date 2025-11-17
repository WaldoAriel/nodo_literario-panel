import { DetallePedido, Pedido, Libro } from "../models/index.js";

// Trae todos los detalles de pedidos (opcionalmente por pedido)
const getAllDetallesPedido = async (req, res) => {
  try {
    const { id_pedido } = req.query;

    const whereClause = {};

    if (id_pedido) {
      whereClause.id_pedido = id_pedido;
    }

    const detalles = await DetallePedido.findAll({
      where: whereClause,
      include: [
        {
          model: Pedido,
          as: "pedido",
          attributes: ["fecha_pedido", "estado_pedido"],
        },
        {
          model: Libro,
          as: "libro",
          attributes: ["titulo", "autor", "precio"],
        },
      ],
    });

    res.json(detalles);
  } catch (error) {
    console.error("❌ Error al obtener detalles de pedido:", error);
    res.status(500).json({ error: "Error al obtener los detalles del pedido" });
  }
};

// trae detalle de pedido por ID
const getDetallePedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetallePedido.findByPk(id, {
      include: [
        {
          model: Pedido,
          as: "pedido",
          attributes: ["fecha_pedido", "estado_pedido"],
        },
        {
          model: Libro,
          as: "libro",
          attributes: ["titulo", "autor", "precio"],
        },
      ],
    });

    if (!detalle) {
      return res
        .status(404)
        .json({ error: "Detalle de pedido no encontrado" });
    }

    res.json(detalle);
  } catch (error) {
    console.error("❌ Error al obtener detalle de pedido por ID:", error);
    res.status(500).json({ error: "Error al obtener el detalle del pedido" });
  }
};

// Crea un nuevo detalle de pedido
const createDetallePedido = async (req, res) => {
  try {
    const { id_pedido, id_libro, cantidad } = req.body;

    if (!id_pedido || !id_libro || cantidad === undefined || cantidad <= 0) {
      return res.status(400).json({
        error:
          "Se requieren id_pedido, id_libro y una cantidad mayor a cero",
      });
    }

    const pedido = await Pedido.findByPk(id_pedido);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const libro = await Libro.findByPk(id_libro);
    if (!libro || !libro.activa) {
      return res.status(404).json({ error: "Libro no encontrado o inactivo" });
    }

    const precio_unitario = libro.precio;
    const subtotal = precio_unitario * cantidad;

    const nuevoDetalle = await DetallePedido.create({
      id_pedido,
      id_libro,
      cantidad,
      precio_unitario,
      subtotal,
    });

    res.status(201).json(nuevoDetalle);
  } catch (error) {
    console.error("❌ Error al crear detalle de pedido:", error);
    res.status(500).json({ error: "Error al crear el detalle del pedido" });
  }
};

// Actualiza la cantidad en el detalle de pedido
const updateDetallePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const detalle = await DetallePedido.findByPk(id, {
      include: [{ model: Libro, as: "libro" }],
    });

    if (!detalle) {
      return res
        .status(404)
        .json({ error: "Detalle de pedido no encontrado" });
    }

    if (cantidad !== undefined && cantidad > 0) {
      detalle.cantidad = cantidad;
      detalle.precio_unitario = detalle.libro.precio;
      detalle.subtotal = detalle.libro.precio * cantidad;
    }

    await detalle.save();

    res.json(detalle);
  } catch (error) {
    console.error("❌ Error al actualizar detalle de pedido:", error);
    res.status(500).json({ error: "Error al actualizar el detalle del pedido" });
  }
};

// Elimina un detalle de pedido
const deleteDetallePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetallePedido.findByPk(id);

    if (!detalle) {
      return res
        .status(404)
        .json({ error: "Detalle de pedido no encontrado" });
    }

    await detalle.destroy();

    res.json({ message: "Detalle de pedido eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar detalle de pedido:", error);
    res.status(500).json({ error: "Error al eliminar el detalle del pedido" });
  }
};

export {
  getAllDetallesPedido,
  getDetallePedidoById,
  createDetallePedido,
  updateDetallePedido,
  deleteDetallePedido,
};