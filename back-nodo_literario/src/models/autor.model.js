import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Autor = sequelize.define(
  "Autor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nacionalidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "autores",
    timestamps: false,
  }
);

export default Autor;