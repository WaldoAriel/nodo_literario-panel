import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar el estado de autenticación al cargar la app
  const checkAuthStatus = async () => {
    try {
      const savedTokens = getStoredTokens();
      if (savedTokens) {
        setTokens(savedTokens);

        // Verificar si el token es válido obteniendo el perfil
        const profile = await authService.getProfile(savedTokens.accessToken);

        // DECODIFICAR EL TOKEN PARA OBTENER EL TIPO DE USUARIO
        const tokenData = JSON.parse(
          atob(savedTokens.accessToken.split(".")[1])
        );

        setUser({
          ...profile.usuario,
          tipo: tokenData.tipo || "cliente",
          rol: tokenData.rol,
        });
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      logout(); // Si hay error, hacer logout
    } finally {
      setLoading(false);
    }
  };

  // Guardar tokens en localStorage
  const storeTokens = (newTokens) => {
    localStorage.setItem("authTokens", JSON.stringify(newTokens));
    setTokens(newTokens);
  };

  // Obtener tokens de localStorage
  const getStoredTokens = () => {
    try {
      const stored = localStorage.getItem("authTokens");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  };

  // Limpiar tokens
  const clearTokens = () => {
    localStorage.removeItem("authTokens");
    setTokens(null);
  };

  // Registro de usuario
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      storeTokens(response.tokens);
      setUser(response.usuario);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error en el registro",
      };
    }
  };

  // Login de usuario
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      storeTokens(response.tokens);

      // GUARDAR USUARIO COMPLETO CON TIPO Y ROL
      setUser({
        ...response.usuario,
        tipo: response.esAdministrador ? "administrador" : "cliente",
        rol: response.rol,
      });

      // Redirigir a la página que intentaban acceder o al home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error en el login",
      };
    }
  };

  // Logout
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  // Refresh token automático
  const refreshAuthToken = async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await authService.refreshToken(tokens.refreshToken);
      storeTokens(response.tokens);
      return response.tokens.accessToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // Obtener token de acceso (con refresh automático si es necesario)
  const getAccessToken = async () => {
    if (!tokens) return null;

    // Verificar si el token está expirado
    try {
      const tokenData = JSON.parse(atob(tokens.accessToken.split(".")[1]));
      const isExpired = tokenData.exp * 1000 < Date.now();

      if (isExpired) {
        return await refreshAuthToken();
      }

      return tokens.accessToken;
    } catch (error) {
      console.error("Error verificando token:", error);
      return null;
    }
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await authService.changePassword(
        token,
        currentPassword,
        newPassword
      );
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error cambiando contraseña",
      };
    }
  };

  // Valor del contexto
  const value = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    getAccessToken,
    changePassword,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
