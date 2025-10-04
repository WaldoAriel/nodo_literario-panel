import authService from '../services/authService.js';

// Login para administradores
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son obligatorios'
      });
    }

    // Pasar true para indicar que es login de admin
    const result = await authService.login(email, password, true);

    res.json({
      message: 'Login de administrador exitoso',
      usuario: result.usuario,
      esAdministrador: result.esAdministrador,
      rol: result.rol,
      tokens: result.tokens
    });

  } catch (error) {
    console.error('❌ Error en login de administrador:', error.message);
    
    if (error.message === 'Credenciales inválidas' || 
        error.message === 'No tienes permisos de administrador') {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export { adminLogin };