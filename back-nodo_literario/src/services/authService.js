import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario, Cliente, Administrador } from "../models/index.js";

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.accessTokenExpiresIn = "40m"; // Token corto para acceso
    this.refreshTokenExpiresIn = "7d"; // Token largo para renovación
  }

  // Generar tokens
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(
      { ...payload, isRefreshToken: true },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  // Verificar token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  // Registrar nuevo usuario y cliente
  async register(userData) {
    const {
      email,
      password,
      nombre,
      apellido,
      telefono,
      tipo_cliente = "regular",
    } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const usuario = await Usuario.create({
      email,
      password_hash,
      nombre,
      apellido,
      telefono,
    });

    // Crear cliente (con datos duplicados por ahora)
    const cliente = await Cliente.create({
      id_usuario: usuario.id,
      nombre,
      apellido,
      email,
      telefono,
      tipo_cliente,
    });

    // Generar tokens
    const payload = {
      userId: usuario.id,
      clienteId: cliente.id,
      email: usuario.email,
      tipo: "cliente",
    };

    const tokens = this.generateTokens(payload);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      cliente: {
        id: cliente.id,
        tipo_cliente: cliente.tipo_cliente,
      },
      tokens,
    };
  }

  // Login
  async login(email, password, isAdminLogin = false) {
    // Buscar usuario con su cliente
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        {
          model: Cliente,
          as: "cliente",
          required: false,
        },
        {
          model: Administrador,
          as: "administrador",
          required: false,
        },
      ],
    });

    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(
      password,
      usuario.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar si es login de admin
  if (isAdminLogin && !usuario.administrador) {
    throw new Error('No tienes permisos de administrador');
  }

  // Determinar tipo de usuario
  let userType = 'cliente';
  let clienteId = usuario.cliente?.id;
  let adminId = usuario.administrador?.id;
  let rol = usuario.administrador?.rol;

  if (usuario.administrador) {
    userType = 'administrador';
  }

  // Generar tokens
  const payload = {
    userId: usuario.id,
    clienteId,
    adminId,
    email: usuario.email,
    tipo: userType,
    rol: rol
  };

  const tokens = this.generateTokens(payload);

  return {
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido
    },
    esAdministrador: !!usuario.administrador,
    rol: rol,
    tokens
  };
}

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);

      if (!decoded.isRefreshToken) {
        throw new Error("Token no válido para refresh");
      }

      // Buscar usuario para verificar que aún existe
      const usuario = await Usuario.findByPk(decoded.userId, {
        attributes: ["id", "email", "nombre", "apellido", "activo"],
      });

      if (!usuario || !usuario.activo) {
        throw new Error("Usuario no encontrado o inactivo");
      }

      // Generar nuevos tokens
      const payload = {
        userId: usuario.id,
        clienteId: decoded.clienteId,
        email: usuario.email,
        tipo: decoded.tipo,
      };

      return this.generateTokens(payload);
    } catch (error) {
      throw new Error("Refresh token inválido");
    }
  }

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      usuario.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Contraseña actual incorrecta");
    }

    // Hash nueva contraseña
    const saltRounds = 12;
    usuario.password_hash = await bcrypt.hash(newPassword, saltRounds);
    await usuario.save();

    return { message: "Contraseña actualizada exitosamente" };
  }
}

export default new AuthService();
