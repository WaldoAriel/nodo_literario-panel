import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    estado_pedido: {
      type: DataTypes.ENUM(
        "pendiente",
        "procesando",
        "enviado",
        "cancelado",
        "completado"
      ),
      defaultValue: "pendiente",
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "direcciones",
        key: "id",
      },
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "metodos_pago",
        key: "id",
      },
    },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  }
);

export default Pedido;
