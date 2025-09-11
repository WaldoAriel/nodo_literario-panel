import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Cupon = sequelize.define("Cupon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descuento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: "El % de descuento del cupón debe ser mayor o igual a cero",
      },
      max: {
        args: [100],
        msg: "El % de descuento del cupón debe ser menor o igual a cien",
      },
    },
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export default Cupon