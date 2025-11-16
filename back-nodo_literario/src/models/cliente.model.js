import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    tipo_cliente: {
      type: DataTypes.ENUM("regular", "premium", "vip"),
      defaultValue: "regular",
    },
  },
  {
    tableName: "clientes",
    timestamps: false,
  }
);

export default Cliente;