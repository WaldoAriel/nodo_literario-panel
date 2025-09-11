import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const DetallePedido = sequelize.define(
  "DetallePedido",
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
    tableName: "detalles_pedido",
    timestamps: false,
  }
);

export default DetallePedido;