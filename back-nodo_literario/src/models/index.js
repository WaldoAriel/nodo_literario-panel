import sequelize from "../db/connection.js";
import ImagenProducto from "./imagenProducto.models.js";

// Modelos Principales
import Categoria from "./categoria.model.js";
import Libro from "./libro.model.js";
import Autor from "./autor.model.js";
import Editorial from "./editorial.model.js";
import Cupon from "./cuponDesc.model.js";
import Mensaje from "./mensaje.model.js";

// Modelos de Usuarios y Roles
import Usuario from "./usuario.model.js";
import Cliente from "./cliente.model.js";
import Administrador from "./administrador.model.js";

// Modelos de Carrito de Compras
import Carrito from "./carrito.model.js";
import CarritoItem from "./carritoItem.model.js";

// Modelos de Pedidos y Transacciones
import Pedido from "./pedido.model.js";
import DetallePedido from "./detallePedido.model.js";
import Direccion from "./direccion.model.js";
import MetodoPago from "./metodoPago.model.js";

// Modelos de Tablas Intermedias (para relaciones N:M)
import LibroAutor from "./libroAutor.model.js"; // Para la relación N:M entre Libro y Autor

// definición de relaciones entre modelos

// Relaciones de Productos (Libros) y sus Atributos

//  Un libro puede tener muchas imagenes

Libro.hasMany(ImagenProducto, {
  foreignKey: "id_libro",
  as: "imagenes",
});
ImagenProducto.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "Libro",
});

// Un Libro pertenece a una Categoría
Categoria.hasMany(Libro, {
  foreignKey: "id_categoria",
  as: "libros",
});
Libro.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

// Un Libro pertenece a una Editorial
Editorial.hasMany(Libro, {
  foreignKey: "id_editorial",
  as: "libros",
});
Libro.belongsTo(Editorial, {
  foreignKey: "id_editorial",
  as: "editorial",
});

// Relación Muchos a Muchos: Libro <-> Autor (a través de LibroAutor)
Libro.belongsToMany(Autor, {
  through: LibroAutor,
  foreignKey: "id_libro",
  otherKey: "id_autor",
  as: "autores",
});
Autor.belongsToMany(Libro, {
  through: LibroAutor,
  foreignKey: "id_autor",
  otherKey: "id_libro",
  as: "libros",
});

// --- Relaciones de Usuarios y Clientes/Administradores ---
// Un Usuario puede ser un Cliente
Usuario.hasOne(Cliente, {
  foreignKey: "id_usuario",
  as: "cliente",
});
Cliente.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Un Usuario puede ser un Administrador
Usuario.hasOne(Administrador, {
  foreignKey: "id_usuario",
  as: "administrador",
});
Administrador.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// --- Relaciones de Clientes y sus Datos ---
// Un Cliente tiene muchas Direcciones
Cliente.hasMany(Direccion, {
  foreignKey: "id_cliente",
  as: "direcciones",
});
Direccion.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// Un Cliente tiene muchos Pedidos
Cliente.hasMany(Pedido, {
  foreignKey: "id_cliente",
  as: "pedidos",
});
Pedido.belongsTo(Cliente, {
  // Un Pedido pertenece a un Cliente
  foreignKey: "id_cliente",
  as: "cliente",
});

// Un Cliente tiene un Carrito de Compras (relación 1:1)
Cliente.hasOne(Carrito, {
  foreignKey: "id_cliente",
  as: "carrito",
});
Carrito.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// --- Relaciones del Carrito de Compras ---
// Un Carrito tiene muchos CarritoItems
Carrito.hasMany(CarritoItem, {
  foreignKey: "id_carrito",
  as: "items",
});
CarritoItem.belongsTo(Carrito, {
  foreignKey: "id_carrito",
  as: "carrito",
});

// Cada CarritoItem se refiere a un Libro
CarritoItem.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "libro",
});

// --- Relaciones de Pedidos y Detalles ---
// Un Pedido tiene muchos DetallePedido (items del pedido)
Pedido.hasMany(DetallePedido, {
  foreignKey: "id_pedido",
  as: "detalles",
});
DetallePedido.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  as: "pedido",
});

// Cada DetallePedido se refiere a un Libro
DetallePedido.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "libro",
});

// Un Pedido usa una Dirección
Pedido.belongsTo(Direccion, {
  foreignKey: "id_direccion",
  as: "direccion",
});

// Un Pedido usa un Método de Pago
Pedido.belongsTo(MetodoPago, {
  foreignKey: "id_metodo_pago",
  as: "metodoPago",
});
MetodoPago.hasMany(Pedido, {
  // Un Método de Pago puede ser usado en muchos Pedidos
  foreignKey: "id_metodo_pago",
  as: "pedidos",
});

// ===============================================
// Exportación de Modelos
// ===============================================

export {
  sequelize,
  Categoria,
  Libro,
  Autor,
  Editorial,
  Cupon,
  Mensaje,
  Usuario,
  Cliente,
  Administrador,
  Carrito,
  CarritoItem,
  Pedido,
  DetallePedido,
  Direccion,
  MetodoPago,
  LibroAutor,
  ImagenProducto,
};
