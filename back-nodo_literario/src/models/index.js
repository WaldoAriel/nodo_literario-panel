import sequelize from "../db/connection.js";

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

// Modelos de Tablas Intermedias
import LibroAutor from "./libroAutor.model.js";
import ImagenProducto from "./imagenProducto.models.js";

// ===== DEFINICIÓN DE RELACIONES =====

// --- Relaciones de Productos (Libros) ---
Libro.hasMany(ImagenProducto, {
  foreignKey: "id_libro",
  as: "imagenes",
});

ImagenProducto.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "libro",
});

Categoria.hasMany(Libro, {
  foreignKey: "id_categoria",
  as: "libros",
});

Libro.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

Editorial.hasMany(Libro, {
  foreignKey: "id_editorial",
  as: "libros",
});

Libro.belongsTo(Editorial, {
  foreignKey: "id_editorial",
  as: "editorial",
});

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

// --- Relaciones de Usuarios y Roles ---
Usuario.hasOne(Cliente, {
  foreignKey: "id_usuario",
  as: "cliente",
});

Cliente.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

Usuario.hasOne(Administrador, {
  foreignKey: "id_usuario",
  as: "administrador",
});

Administrador.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// --- Relaciones de Clientes ---
Cliente.hasMany(Direccion, {
  foreignKey: "id_cliente",
  as: "direcciones",
});

Direccion.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

Cliente.hasMany(Pedido, {
  foreignKey: "id_cliente",
  as: "pedidos",
});

Pedido.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

Cliente.hasOne(Carrito, {
  foreignKey: "id_cliente",
  as: "carrito",
});

Carrito.belongsTo(Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

// --- Relaciones del Carrito ---
Carrito.hasMany(CarritoItem, {
  foreignKey: "id_carrito",
  as: "items",
});

CarritoItem.belongsTo(Carrito, {
  foreignKey: "id_carrito",
  as: "carrito",
});

CarritoItem.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "libro",
});

// --- Relaciones de Pedidos ---
Pedido.hasMany(DetallePedido, {
  foreignKey: "id_pedido",
  as: "detalles",
});

DetallePedido.belongsTo(Pedido, {
  foreignKey: "id_pedido",
  as: "pedido",
});

DetallePedido.belongsTo(Libro, {
  foreignKey: "id_libro",
  as: "libro",
});

Pedido.belongsTo(Direccion, {
  foreignKey: "id_direccion",
  as: "direccion",
});

Pedido.belongsTo(MetodoPago, {
  foreignKey: "id_metodo_pago",
  as: "metodoPago",
});

MetodoPago.hasMany(Pedido, {
  foreignKey: "id_metodo_pago",
  as: "pedidos",
});

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