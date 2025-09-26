import express from "express";
import cors from "cors";
import { sequelize, Categoria, Libro } from "./src/models/index.js";
import path from "path";
import { fileURLToPath } from "url";
import categoriaRoutes from "./src/routes/categoria.routes.js";
import libroRoutes from "./src/routes/libro.routes.js";  // público
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
import editorialRoutes from "./src/routes/editoriales.routes.js";
import adminLibrosRoutes from "./src/routes/admin/libros.routes.js";  // admin 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api", categoriaRoutes);
app.use("/api", libroRoutes); 
app.use("/api", mensajeRoutes);
app.use("/api", clienteRoutes);
app.use("/api", carritoRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", metodoPagoRoutes);
app.use("/api", direccionRoutes);
app.use("/api", detallePedidoRoutes);
app.use("/api", administradorRoutes);
app.use("/api", imagenProductoRoutes);
app.use("/api", autorRoutes);
app.use("/api", editorialRoutes);

// Router para admin libros (CRUD + upload)
app.use("/api/admin/libros", adminLibrosRoutes); 

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
