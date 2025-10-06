import {
  Carrito,
  CarritoItem,
  Libro,
  ImagenProducto,
  Autor
} from "../models/index.js";

// Obtener carrito por ID (por ejemplo, usando session_id o id_cliente) COMENTADO PARA DEBUG
/* const getCarrito = async (req, res) => {
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
}; */

// FUNCIÓN actualizarCantidad - DEBE ESTAR EN EL NIVEL SUPERIOR
const actualizarCantidad = async (req, res) => {
  try {
    const { id_carrito, id_libro, cantidad } = req.body;

    // Validaciones básicas
    if (!id_carrito || !id_libro || !cantidad) {
      return res.status(400).json({
        error: "Datos incompletos: id_carrito, id_libro y cantidad son requeridos",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        error: "La cantidad debe ser mayor a 0",
      });
    }

    // Buscar el libro para verificar stock
    const libro = await Libro.findByPk(id_libro);
    if (!libro) {
      return res.status(404).json({
        error: "Libro no encontrado",
      });
    }

    // Validar stock disponible
    if (libro.stock < cantidad) {
      return res.status(400).json({
        error: `Stock insuficiente. Solo quedan ${libro.stock} unidades disponibles`,
        stockDisponible: libro.stock
      });
    }

    // Buscar el item en el carrito
    const carritoItem = await CarritoItem.findOne({
      where: {
        id_carrito,
        id_libro,
      },
    });

    if (!carritoItem) {
      return res.status(404).json({
        error: "Item no encontrado en el carrito",
      });
    }

    // Actualizar cantidad
    await carritoItem.update({
      cantidad: cantidad,
      subtotal: carritoItem.precio_unitario * cantidad,
    });

    // Recargar el carrito completo para enviar respuesta
    const carritoActualizado = await Carrito.findByPk(id_carrito, {
      include: [
        {
          model: CarritoItem,
          as: "items",
          include: [
            {
              model: Libro,
              as: "libro",
              include: [
                {
                  model: Autor,
                  as: "autores",
                  through: { attributes: [] },
                },
                {
                  model: ImagenProducto,
                  as: "imagenes",
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(carritoActualizado);
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    res.status(500).json({
      error: "Error interno del servidor al actualizar cantidad",
    });
  }
};
// **** DEBUG ****
const getCarrito = async (req, res) => {
  try {
    const { id_cliente, session_id } = req.query;

    if (!id_cliente && !session_id) {
      console.log("❌ Error: No se recibió id_cliente ni session_id");
      return res.status(400).json({
        error: "Se requiere id_cliente o session_id",
      });
    }

    let carrito = await Carrito.findOne({
      where: id_cliente ? { id_cliente } : { session_id },
      include: [
        {
          model: CarritoItem,
          as: "items",
          include: [
            {
              model: Libro,
              as: "libro",
              include: [
                {
                  model: ImagenProducto,
                  as: "imagenes",
                },
              ],
            },
          ],
        },
      ],
    });

    console.log(
      "📋 Resultado de búsqueda:",
      carrito ? `Carrito ID: ${carrito.id}` : "NO ENCONTRADO"
    );

    if (!carrito) {
      console.log("❌ Carrito no encontrado en la BD");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(carrito);
  } catch (error) {
    console.error("❌ Error al obtener carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};
// FIN DEBUG

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

//función para calcular subtotal
const calculateSubtotal = (cantidad, precioUnitario) => {
  return cantidad * precioUnitario;
};

// Agregar un libro al carrito
const addItemToCarrito = async (req, res) => {
  try {
    const { id_carrito, id_libro, cantidad = 1 } = req.body; // 🆕 valor por defecto

    // Validar
    if (cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    const libro = await Libro.findByPk(id_libro);
    if (!libro || !libro.activa) {
      return res.status(404).json({ error: "Libro no encontrado o inactivo" });
    }

    if (libro.stock < cantidad) {
      return res.status(400).json({
        error: `Stock insuficiente. Solo quedan ${libro.stock} unidades`,
      });
    }

    // Verificar si ya existe este libro en el carrito
    let item = await CarritoItem.findOne({
      where: { id_carrito, id_libro },
    });

    const nuevoPrecio = libro.precio; // Usar precio actual del libro
    const nuevaCantidad = item ? item.cantidad + cantidad : cantidad;

    if (item) {
      // Si existe, actualizamos
      item.cantidad = nuevaCantidad;
      item.precio_unitario = nuevoPrecio; // Actualizar precio por si cambió
      item.subtotal = calculateSubtotal(nuevaCantidad, nuevoPrecio);
      await item.save();
    } else {
      // Si no existe, lo creamos
      item = await CarritoItem.create({
        id_carrito,
        id_libro,
        cantidad: nuevaCantidad,
        precio_unitario: nuevoPrecio,
        subtotal: calculateSubtotal(nuevaCantidad, nuevoPrecio),
      });
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
  actualizarCantidad,
};
