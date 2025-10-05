import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const CarritoItem = sequelize.define(
  "CarritoItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_libro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "carrito_items",
    timestamps: false,
  }
);

// AGREGAR ESTAS ASOCIACIONES AL FINAL
CarritoItem.associate = function(models) {
  CarritoItem.belongsTo(models.Carrito, {
    foreignKey: 'id_carrito',
    as: 'carrito'
  });
  CarritoItem.belongsTo(models.Libro, {
    foreignKey: 'id_libro',
    as: 'libro'
  });
};

export default CarritoItem;