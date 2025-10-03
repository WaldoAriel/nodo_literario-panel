import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario aún existe y está activo
    const usuario = await Usuario.findByPk(decoded.userId, {
      attributes: ['id', 'activo']
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    req.user = decoded;
    next();

  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    res.status(500).json({ error: 'Error en autenticación' });
  }
};

// Middleware opcional (para rutas que pueden ser públicas o privadas)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findByPk(decoded.userId, {
        attributes: ['id', 'activo']
      });

      if (usuario && usuario.activo) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Si hay error con el token, continuamos sin autenticación
    next();
  }
};