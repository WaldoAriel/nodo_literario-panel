import authService from '../services/authService.js';
import { Usuario, Cliente } from '../models/index.js';
import { OAuth2Client } from 'google-auth-library';

// Configurar cliente de Google OAuth
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Controlador para iniciar flujo OAuth
const googleAuth = (req, res) => {
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback`;
  const authUrl = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    redirect_uri: redirectUrl,
    include_granted_scopes: true
  });
  
  res.json({ authUrl });
};


// En la función googleCallback - AGREGAR LOGS
const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    
    console.log('🔐 1. Código recibido:', code ? '✅' : '❌ No recibido');
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Código de autorización requerido'
      });
    }

    const redirectUri = `${process.env.FRONTEND_URL}/auth/google/callback`;
    console.log('🔐 2. Redirect URI:', redirectUri);

    // Intercambiar código por tokens
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: redirectUri
    });
    
    console.log('🔐 3. Tokens de Google recibidos:', tokens ? '✅' : '❌');
    
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log('🔐 4. Payload de Google:', {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub
    });

    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Buscar usuario existente por googleId
    let usuario = await Usuario.findOne({
      where: { googleId },
      include: [
        {
          model: Cliente,
          as: "cliente",
          required: false,
        }
      ]
    });

    console.log('🔐 5. Usuario encontrado por googleId:', usuario ? '✅' : '❌ No encontrado');

    if (!usuario) {
      // Buscar por email
      usuario = await Usuario.findOne({ 
        where: { email },
        include: [
          {
            model: Cliente,
            as: "cliente",
            required: false,
          }
        ]
      });
      
      console.log('🔐 6. Usuario encontrado por email:', usuario ? '✅' : '❌ No encontrado');

      if (usuario) {
        // Usuario existe pero sin Google - actualizar
        console.log('🔐 7. Actualizando usuario existente con Google ID');
        usuario.googleId = googleId;
        usuario.authProvider = 'google';
        usuario.isEmailVerified = email_verified;
        usuario.avatar = picture;
        await usuario.save();
      } else {
        // Crear nuevo usuario con Google
        console.log('🔐 8. Creando nuevo usuario con Google');
        const [nombre, ...apellidoParts] = name.split(' ');
        const apellido = apellidoParts.join(' ') || '';
        
        usuario = await Usuario.create({
          email,
          nombre,
          apellido,
          googleId,
          authProvider: 'google',
          isEmailVerified: email_verified,
          avatar: picture,
          password_hash: null,
          telefono: null,
          activo: true
        });

        // Crear cliente asociado
        const cliente = await Cliente.create({
          id_usuario: usuario.id,
          nombre: nombre,
          apellido: apellido,
          email: email,
          telefono: null,
          fecha_registro: new Date(),
          tipo_cliente: 'regular'
        });

        usuario.cliente = cliente;
      }
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      console.log('🔐 9. Usuario inactivo');
      return res.status(401).json({
        success: false,
        error: 'Cuenta desactivada'
      });
    }

    console.log('🔐 10. Generando tokens JWT');
    // Generar tokens usando tu servicio existente
    const tokenPayload = {
      userId: usuario.id,
      clienteId: usuario.cliente?.id,
      email: usuario.email,
      tipo: "cliente",
    };

    const tokensResponse = authService.generateTokens(tokenPayload);

    console.log('🔐 11. Autenticación exitosa para:', usuario.email);
    res.json({
      success: true,
      message: 'Autenticación con Google exitosa',
      tokens: tokensResponse,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        avatar: usuario.avatar,
        esAdministrador: false,
        tipo: 'cliente'
      }
    });

  } catch (error) {
    console.error('❌ ERROR COMPLETO en Google OAuth:', error);
    console.error('❌ Stack trace:', error.stack);
    
    if (error.message.includes('invalid_grant')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Código de autorización inválido o expirado' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Error en autenticación con Google: ' + error.message 
    });
  }
};

// Controlador para manejar callback de Google
/* const googleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Código de autorización requerido'
      });
    }

    // Intercambiar código por tokens de Google
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`
    });
    
    // Verificar el token de Google
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Buscar usuario existente por googleId
    let usuario = await Usuario.findOne({
      where: { googleId },
      include: [
        {
          model: Cliente,
          as: "cliente",
          required: false,
        }
      ]
    });

    if (!usuario) {
      // Buscar por email
      usuario = await Usuario.findOne({ 
        where: { email },
        include: [
          {
            model: Cliente,
            as: "cliente",
            required: false,
          }
        ]
      });
      
      if (usuario) {
        // Usuario existe pero sin Google - actualizar
        usuario.googleId = googleId;
        usuario.authProvider = 'google';
        usuario.isEmailVerified = email_verified;
        usuario.avatar = picture;
        await usuario.save();
      } else {
        // Crear nuevo usuario con Google
        const [nombre, ...apellidoParts] = name.split(' ');
        const apellido = apellidoParts.join(' ') || '';
        
        usuario = await Usuario.create({
          email,
          nombre,
          apellido,
          googleId,
          authProvider: 'google',
          isEmailVerified: email_verified,
          avatar: picture,
          password_hash: null,
          telefono: null,
          activo: true
        });

        // Crear cliente asociado (MANTENIENDO LA ESTRUCTURA ACTUAL)
        const cliente = await Cliente.create({
          id_usuario: usuario.id,
          nombre: nombre,
          apellido: apellido,
          email: email,
          telefono: null,
          fecha_registro: new Date(),
          tipo_cliente: 'regular'
        });

        // Asociar cliente al usuario para la respuesta
        usuario.cliente = cliente;
      }
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        error: 'Cuenta desactivada'
      });
    }

    // Generar tokens usando tu servicio existente - CORREGIDO
    const tokenPayload = {
      userId: usuario.id,
      clienteId: usuario.cliente?.id,
      email: usuario.email,
      tipo: "cliente",
    };

    const tokensResponse = authService.generateTokens(tokenPayload);

    res.json({
      success: true,
      message: 'Autenticación con Google exitosa',
      tokens: tokensResponse,
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        avatar: usuario.avatar,
        esAdministrador: false,
        tipo: 'cliente'
      }
    });

  } catch (error) {
    console.error('❌ Error en Google OAuth:', error);
    
    if (error.message.includes('invalid_grant')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Código de autorización inválido o expirado' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Error en autenticación con Google' 
    });
  }
}; */

// Registro de nuevo usuario
const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono, tipo_cliente } = req.body;

    // Validaciones básicas
    if (!email || !password || !nombre) {
      return res.status(400).json({
        error: 'Email, contraseña y nombre son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const result = await authService.register({
      email,
      password,
      nombre,
      apellido,
      telefono,
      tipo_cliente
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: result.usuario,
      cliente: result.cliente,
      tokens: result.tokens
    });

  } catch (error) {
    console.error('❌ Error en registro:', error.message);
    
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios'
      });
    }

    const result = await authService.login(email, password);

    res.json({
      message: 'Login exitoso',
      usuario: result.usuario,
      tokens: result.tokens
    });

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    
    if (error.message === 'Credenciales inválidas' || error.message === 'Cuenta desactivada') {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token es requerido' });
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.json({
      message: 'Token actualizado exitosamente',
      tokens
    });

  } catch (error) {
    console.error('❌ Error en refresh token:', error.message);
    res.status(401).json({ error: error.message });
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // Del middleware de autenticación

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Contraseña actual y nueva contraseña son obligatorias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    res.json(result);

  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error.message);
    
    if (error.message === 'Contraseña actual incorrecta') {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const usuario = await Usuario.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'tipo_cliente', 'fecha_registro']
      }]
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario });

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export {
  register,
  login,
  refreshToken,
  changePassword,
  getProfile,
  googleAuth,
  googleCallback
};