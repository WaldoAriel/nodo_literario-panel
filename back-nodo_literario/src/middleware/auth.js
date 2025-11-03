import jwt from 'jsonwebtoken'; 
import { Usuario } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 authenticateToken - Headers:', req.headers);
    console.log('🔐 authenticateToken - Cookies:', req.cookies);
    
    const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log('🔐 Token encontrado:', token ? 'SÍ' : 'NO');

    if (!token) {
      console.log('🔐 ❌ No hay token');
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← Aquí usa jwt
    console.log('🔐 Token decodificado:', decoded);

    const usuario = await Usuario.findByPk(decoded.userId, { attributes: ['id', 'activo'] });
    console.log('🔐 Usuario encontrado en DB:', usuario ? 'SÍ' : 'NO');

    if (!usuario || !usuario.activo) {
      console.log('🔐 ❌ Usuario no encontrado o inactivo');
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    req.user = decoded;
    console.log('🔐 ✅ Autenticación exitosa');
    next();

  } catch (error) {
    console.error('❌ ERROR en authenticateToken:', error.message);
    
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Token inválido' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expirado' });
    res.status(500).json({ error: 'Error en autenticación' });
  }
};
