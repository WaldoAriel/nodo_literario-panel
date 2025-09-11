import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const CarritoItem = sequelize.define(
  "CarritoItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
      comment: "Precio al momento de agregar al carrito",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "cantidad * precio_unitario",
    },
  },
  {
    tableName: "carrito_items",
    timestamps: false,
  }
);

export default CarritoItem;