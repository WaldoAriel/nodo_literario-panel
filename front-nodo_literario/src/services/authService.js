import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - podrías implementar refresh automático aquí
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Login normal
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error en el login');
  }
};

// Registro normal
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error en el registro');
  }
};

// Refresh token
const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al refrescar token');
  }
};

// Cambiar contraseña
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al cambiar contraseña');
  }
};

// Obtener perfil
const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener perfil');
  }
};

// OAuth con Google
const googleAuth = async () => {
  try {
    const response = await api.get('/auth/google');
    return response.data.authUrl;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener URL de Google');
  }
};

const googleCallback = async (code) => {
  try {
    const response = await api.post('/auth/google/callback', { code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error en autenticación con Google');
  }
};

// Exportar todas las funciones
export {
  login,
  register,
  refreshToken,
  changePassword,
  getProfile,
  googleAuth,
  googleCallback
};