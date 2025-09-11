import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const LibroAutor = sequelize.define(
  "LibroAutor",
  {
    id_libro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "libros", // nombre de la tabla
        key: "id",
      },
    },
    id_autor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "autores", 
        key: "id",
      },
    },
  },
  {
    tableName: "libro_autores",
    timestamps: false,
    freezeTableName: true,    // para que Sequelize no agregue su propia PK

  }
);

export default LibroAutor;