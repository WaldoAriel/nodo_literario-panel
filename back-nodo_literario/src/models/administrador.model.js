import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Administrador = sequelize.define(
  "Administrador",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      // field: "id_admin" - la columna se llama "id"
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    rol: {
      type: DataTypes.ENUM("superadmin", "gestor_inventario", "soporte"),
      defaultValue: "gestor_inventario",
      allowNull: false,
    },
    fecha_alta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "administradores",
    timestamps: false,
  }
);

export default Administrador;