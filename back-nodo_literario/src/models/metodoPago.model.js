import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const MetodoPago = sequelize.define(
  "MetodoPago",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre_metodo: {
      type: DataTypes.ENUM("Tarjeta", "Mercado Pago", "Efectivo en entrega", "Transferencia"),
      allowNull: false,
      unique: true,
      comment: "Métodos de pago disponibles",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Descripción opcional del método de pago",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "metodos_pago",
    timestamps: false,
  }
);

export default MetodoPago;