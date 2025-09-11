import express from "express";
import cors from "cors";
import { sequelize, Categoria, Libro } from "./src/models/index.js";
import categoriaRoutes from "./src/routes/categoria.routes.js";
import libroRoutes from "./src/routes/libro.routes.js";
import mensajeRoutes from "./src/routes/mensaje.routes.js";
import clienteRoutes from "./src/routes/clientes.routes.js";
import carritoRoutes from "./src/routes/carrito.routes.js";
import pedidoRoutes from "./src/routes/pedido.routes.js";
import metodoPagoRoutes from "./src/routes/metodoPago.routes.js";
import direccionRoutes from "./src/routes/direccion.routes.js";
import detallePedidoRoutes from "./src/routes/detallePedido.routes.js";
import administradorRoutes from "./src/routes/administrador.routes.js";
import imagenProductoRoutes from "./src/routes/ImagenProducto.routes.js";
import autorRoutes from "./src/routes/autor.routes.js";
import libroAdminRoutes from "./src/routes/admin/libros.routes.js"
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use(categoriaRoutes);
app.use(libroRoutes);
app.use(mensajeRoutes);
app.use(clienteRoutes);
app.use(carritoRoutes);
app.use(pedidoRoutes);
app.use(metodoPagoRoutes);
app.use(direccionRoutes);
app.use(detallePedidoRoutes);
app.use(administradorRoutes);
app.use(imagenProductoRoutes);
app.use(autorRoutes);
app.use("/api/admin/libros", libroAdminRoutes)

app.get("/", (req, res) => {
  res.send("¡Backend funcionando!");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");

    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ No se pudo conectar a la base de datos o sincronizar modelos:",
      error
    );
  }
}

startServer();
