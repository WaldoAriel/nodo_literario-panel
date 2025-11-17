import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "carritos",
    timestamps: false,
  }
);

export default Carrito;
