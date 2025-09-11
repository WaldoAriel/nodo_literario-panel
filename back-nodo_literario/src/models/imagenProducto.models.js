import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const ImagenProducto = sequelize.define(
  "ImagenProducto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    urlImagen: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_libro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ImagenesProducto",
    timestamps: false,
  }
);

export default ImagenProducto;
