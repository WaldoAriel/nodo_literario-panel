import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Configurar axios para incluir credenciales
axios.defaults.withCredentials = false;

const authService = {
  // Registro de usuario
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  // Login de usuario
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken
    });
    return response.data;
  },

  // Obtener perfil de usuario
  getProfile: async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (token, currentPassword, newPassword) => {
    const response = await axios.put(`${API_URL}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default authService;