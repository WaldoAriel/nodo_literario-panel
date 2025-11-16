import authService from "../services/authService.js";
import { Usuario, Cliente } from "../models/index.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const setAuthCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout exitoso" });
};

const googleAuth = (req, res) => {
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback`;
  const authUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    redirect_uri: redirectUrl,
    include_granted_scopes: true,
  });

  res.json({ authUrl });
};

const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ error: "Código de autorización requerido" });
    }

    const redirectUri = `${process.env.FRONTEND_URL}/auth/google/callback`;
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: redirectUri,
    });

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    let usuario = await Usuario.findOne({
      where: { googleId },
      include: [{ model: Cliente, as: "cliente", required: false }],
    });

    if (!usuario) {
      usuario = await Usuario.findOne({
        where: { email },
        include: [{ model: Cliente, as: "cliente", required: false }],
      });

      if (usuario) {
        usuario.googleId = googleId;
        usuario.authProvider = "google";
        usuario.isEmailVerified = email_verified;
        usuario.avatar = picture;
        await usuario.save();
      } else {
        const [nombre, ...apellidoParts] = name.split(" ");
        const apellido = apellidoParts.join(" ") || "";

        usuario = await Usuario.create({
          email,
          nombre,
          apellido,
          googleId,
          authProvider: "google",
          isEmailVerified: email_verified,
          avatar: picture,
          password_hash: null,
          telefono: null,
          activo: true,
        });

        await Cliente.create({
          id_usuario: usuario.id,
          fecha_registro: new Date(),
          tipo_cliente: "regular",
        });
      }
    }

    if (!usuario.activo) {
      return res.status(401).json({ error: "Cuenta desactivada" });
    }

    const tokenPayload = {
      userId: usuario.id,
      clienteId: usuario.cliente?.id,
      email: usuario.email,
      tipo: "cliente",
    };

    const tokensResponse = authService.generateTokens(tokenPayload);
    setAuthCookies(res, tokensResponse);

    

    res.json({
      message: "Autenticación con Google exitosa",
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        avatar: usuario.avatar,
        esAdministrador: false,
        tipo: "cliente",
      },
      esAdministrador: false,
      rol: "cliente",
    });
  } catch (error) {
    console.error("🔥 ERROR DETALLADO en googleCallback:", error);
    console.error("🔥 Stack trace:", error.stack);

    if (error.message.includes("invalid_grant")) {
      return res
        .status(400)
        .json({ error: "Código de autorización inválido o expirado" });
    }

    res.status(500).json({
      error: "Error en autenticación con Google",
      details: error.message, // ← Agrega esto temporalmente
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, tipo_cliente } =
      req.body;

    console.log("📝 Intentando registrar usuario:", { email, nombre });

    if (!email || !password || !nombre) {
      return res
        .status(400)
        .json({ error: "Email, contraseña y nombre son obligatorios" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const result = await authService.register({
      email,
      password,
      nombre,
      apellido,
      telefono,
      tipo_cliente,
    });
    
    console.log("✅ Registro exitoso en authService, configurando cookies...");
    
    setAuthCookies(res, result.tokens);

    console.log("✅ Cookies configuradas, enviando respuesta...");

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: result.usuario,
    });

    console.log("✅ Respuesta enviada al frontend");

  } catch (error) {
    console.error("🔥 ERROR en register controller:", error);
    console.error("🔥 Stack trace:", error.stack);
    
    if (error.message === "El email ya está registrado") {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const result = await authService.login(email, password);
    setAuthCookies(res, result.tokens);

    res.json({
      message: "Login exitoso",
      usuario: result.usuario,
      esAdministrador: result.esAdministrador,
      rol: result.rol,
    });
  } catch (error) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token es requerido" });
    }

    const tokens = await authService.refreshToken(refreshToken);
    setAuthCookies(res, tokens);

    res.json({ message: "Token actualizado exitosamente" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Contraseña actual y nueva contraseña son obligatorias",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }

    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    if (error.message === "Contraseña actual incorrecta") {
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const usuario = await Usuario.findByPk(userId, {
      include: [
        {
          model: Cliente,
          as: "cliente",
          attributes: ["id", "tipo_cliente", "fecha_registro"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuarioSinPassword = { ...usuario.toJSON() };
    delete usuarioSinPassword.passwordHash;

    res.json({ usuario: usuarioSinPassword });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export {
  register,
  login,
  refreshToken,
  changePassword,
  getProfile,
  googleAuth,
  googleCallback,
  logout,
};
