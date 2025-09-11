import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Mensaje = sequelize.define(
  "Mensaje",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    libroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "mensajes",
    timestamps: false,
  }
);

export default Mensaje;