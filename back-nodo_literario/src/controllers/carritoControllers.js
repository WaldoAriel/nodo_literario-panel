import { Carrito, CarritoItem, Libro } from "../models/index.js";

// Obtener carrito por ID (por ejemplo, usando session_id o id_cliente)
const getCarrito = async (req, res) => {
  try {
    const { id_cliente, session_id } = req.query;

    if (!id_cliente && !session_id) {
      return res.status(400).json({
        error: "Se requiere id_cliente o session_id",
      });
    }

    let carrito = await Carrito.findOne({
      where: id_cliente ? { id_cliente } : { session_id },
    });

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Incluimos los ítems del carrito y sus libros
    await carrito.$get("items", {
      include: [{ model: Libro, as: "libro" }],
    });

    res.json(carrito);
  } catch (error) {
    console.error("❌ Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Crear un nuevo carrito
const createCarrito = async (req, res) => {
  try {
    const { id_cliente, session_id } = req.body;

    if (!id_cliente && !session_id) {
      return res.status(400).json({
        error: "Se requiere id_cliente o session_id",
      });
    }

    const nuevoCarrito = await Carrito.create({
      id_cliente,
      session_id,
    });

    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error("❌ Error al crear carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};

// Agregar un libro al carrito
const addItemToCarrito = async (req, res) => {
  try {
    const { id_carrito, id_libro, cantidad } = req.body;

    const carrito = await Carrito.findByPk(id_carrito);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const libro = await Libro.findByPk(id_libro);

    if (!libro || !libro.activa) {
      return res.status(404).json({ error: "Libro no encontrado o inactivo" });
    }

    if (cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    // Verificar si ya existe este libro en el carrito
    let item = await CarritoItem.findOne({
      where: { id_carrito, id_libro },
    });

    if (item) {
      // Si ya existe, actualizamos la cantidad
      item.cantidad += cantidad;
      await item.save();
    } else {
      // Si no existe, lo creamos
      item = await CarritoItem.create({
        id_carrito,
        id_libro,
        cantidad,
        precio_unitario: libro.precio,
        subtotal: libro.precio * cantidad,
      });

      await carrito.$add("items", item); // para asociar el item al carrito
    }

    res.status(201).json(item);
  } catch (error) {
    console.error("❌ Error al agregar ítem al carrito:", error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
};

// Eliminar ítem del carrito
const removeItemFromCarrito = async (req, res) => {
  try {
    const { id_carrito, id_libro } = req.body;

    const item = await CarritoItem.findOne({
      where: { id_carrito, id_libro },
    });

    if (!item) {
      return res
        .status(404)
        .json({ error: "Ítem no encontrado en el carrito" });
    }

    await item.destroy();

    res.json({ message: "Ítem eliminado del carrito" });
  } catch (error) {
    console.error("❌ Error al eliminar ítem del carrito:", error);
    res.status(500).json({ error: "Error al modificar el carrito" });
  }
};

// Vaciar carrito
const clearCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.body;

    const carrito = await Carrito.findByPk(id_carrito);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await CarritoItem.destroy({
      where: { id_carrito },
    });

    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("❌ Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

export {
  getCarrito,
  createCarrito,
  addItemToCarrito,
  removeItemFromCarrito,
  clearCarrito,
};
