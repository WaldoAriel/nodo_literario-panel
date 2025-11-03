import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario, Cliente, Administrador } from "../models/index.js";

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ ...payload, isRefreshToken: true }, this.jwtSecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  async register(userData) {
    const { email, password, nombre, apellido, telefono, tipo_cliente = "regular" } = userData;

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) throw new Error("El email ya está registrado");

    const password_hash = await bcrypt.hash(password, 12);
    const usuario = await Usuario.create({ email, passwordHash: password_hash, nombre, apellido, telefono });

    const cliente = await Cliente.create({
      id_usuario: usuario.id,
      nombre,
      apellido,
      email,
      telefono,
      tipo_cliente,
    });

    const payload = { userId: usuario.id, clienteId: cliente.id, email: usuario.email, tipo: "cliente" };
    const tokens = this.generateTokens(payload);

    return { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido }, tokens };
  }

  async login(email, password, isAdminLogin = false) {
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Cliente, as: "cliente", required: false }, { model: Administrador, as: "administrador", required: false }],
    });

    if (!usuario) throw new Error("Credenciales inválidas");

    const isValidPassword = await bcrypt.compare(password, usuario.passwordHash);
    if (!isValidPassword) throw new Error("Credenciales inválidas");

    if (isAdminLogin && !usuario.administrador) throw new Error("No tienes permisos de administrador");

    const userType = usuario.administrador ? "administrador" : "cliente";
    const payload = {
      userId: usuario.id,
      clienteId: usuario.cliente?.id,
      adminId: usuario.administrador?.id,
      email: usuario.email,
      tipo: userType,
      rol: usuario.administrador?.rol,
    };

    const tokens = this.generateTokens(payload);

    return {
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido },
      esAdministrador: !!usuario.administrador,
      rol: usuario.administrador?.rol,
      tokens,
    };
  }

  async refreshToken(refreshToken) {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded.isRefreshToken) throw new Error("Token no válido para refresh");

    const usuario = await Usuario.findByPk(decoded.userId, { attributes: ["id", "email", "nombre", "apellido", "activo"] });
    if (!usuario || !usuario.activo) throw new Error("Usuario no encontrado o inactivo");

    const payload = { userId: usuario.id, clienteId: decoded.clienteId, email: usuario.email, tipo: decoded.tipo };
    return this.generateTokens(payload);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) throw new Error("Usuario no encontrado");

    const isValidPassword = await bcrypt.compare(currentPassword, usuario.passwordHash);
    if (!isValidPassword) throw new Error("Contraseña actual incorrecta");

    usuario.passwordHash = await bcrypt.hash(newPassword, 12);
    await usuario.save();

    return { message: "Contraseña actualizada exitosamente" };
  }
}

export default new AuthService();