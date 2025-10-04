import { Administrador } from '../models/index.js';

export const requireAdmin = async (req, res, next) => {
  try {
    // Asumiendo que ya pasó por el middleware de autenticación normal
    if (req.user.tipo !== 'administrador') {
      return res.status(403).json({ 
        error: 'Se requieren permisos de administrador' 
      });
    }

    // Verificar que aún existe como administrador
    const admin = await Administrador.findByPk(req.user.adminId);
    if (!admin) {
      return res.status(403).json({ 
        error: 'Permisos de administrador revocados' 
      });
    }

    req.admin = admin;
    next();

  } catch (error) {
    console.error('❌ Error en verificación de admin:', error);
    res.status(500).json({ error: 'Error en verificación de permisos' });
  }
};