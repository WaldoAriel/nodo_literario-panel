import authService from '../services/authService.js';
import { Usuario, Cliente } from '../models/index.js';

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

    if (password.length < 7) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 7 caracteres'
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
  getProfile
};