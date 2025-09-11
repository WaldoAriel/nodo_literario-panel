import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Direccion = sequelize.define(
  "Direccion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    calle: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(20), // por si incluye letras
      allowNull: false,
    },
    piso: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    departamento: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clientes",
        key: "id",
      },
    },
  },
  {
    tableName: "direcciones",
    timestamps: false,
  }
);

export default Direccion;