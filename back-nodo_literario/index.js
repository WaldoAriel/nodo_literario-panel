import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { sequelize } from "./src/models/index.js";

// Routes
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
import editorialRoutes from "./src/routes/editoriales.routes.js";
import adminLibrosRoutes from "./src/routes/admin/libros.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminAuthRoutes from "./src/routes/admin/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", categoriaRoutes);
app.use("/api", libroRoutes);
app.use("/api", mensajeRoutes);
app.use("/api", clienteRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api", pedidoRoutes);
app.use("/api", metodoPagoRoutes);
app.use("/api", direccionRoutes);
app.use("/api", detallePedidoRoutes);
app.use("/api", administradorRoutes);
app.use("/api", imagenProductoRoutes);
app.use("/api", autorRoutes);
app.use("/api", editorialRoutes);
app.use("/api/admin/libros", adminLibrosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.get("/", (req, res) => {
  res.send("¡Backend funcionando!");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    ("✅ Conexión a la base de datos establecida correctamente.");

    await sequelize.sync({ force: false });

    httpServer.listen(3000, () => {
      console.log("Servidor corriendo en puerto 3000 con WebSockets");
    });
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error);
  }
}

startServer();
