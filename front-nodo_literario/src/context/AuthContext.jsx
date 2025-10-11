import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  login as loginService,
  register as registerService,
  getProfile,
  changePassword as changePasswordService,
  refreshToken as refreshTokenService,
  googleCallback as googleCallbackService,
} from "../services/authService";

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
      if (savedTokens && savedTokens.accessToken) {
        setTokens(savedTokens);

        // Obtener perfil usando el servicio del FRONTEND
        const profile = await getProfile();

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
      logout();
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

  // Función: Manejar login exitoso (para OAuth y normal)
  const handleSuccessfulLogin = (response, isOAuth = false) => {
    storeTokens(response.tokens);

    // Para OAuth, la respuesta viene con user directamente
    if (isOAuth) {
      setUser({
        ...response.user,
        tipo: "cliente", // OAuth solo para clientes
        rol: null,
      });
    } else {
      // Para login normal
      setUser({
        ...response.usuario,
        tipo: response.esAdministrador ? "administrador" : "cliente",
        rol: response.rol,
      });
    }

    // Redirigir a la página que intentaban acceder o al home
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });

    return { success: true, data: response };
  };

  // Registro de usuario - CORREGIDO
  const register = async (userData) => {
    try {
      const response = await registerService(userData); // ✅ usar registerService
      return handleSuccessfulLogin(response);
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
      const response = await loginService(email, password); // ✅ usar loginService
      return handleSuccessfulLogin(response);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error en el login",
      };
    }
  };
  // Login con Google OAuth
  const loginWithGoogle = async (code) => {
    try {
      const response = await googleCallbackService(code);
      return handleSuccessfulLogin(response, true);
    } catch (error) {
      return {
        success: false,
        error: error.message || "Error en autenticación con Google",
      };
    }
  };

  // Logout
  const logout = () => {
    clearTokens();
    setUser(null);
    navigate("/");
  };

  // Refresh token automático
  const refreshAuthToken = async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await refreshTokenService(tokens.refreshToken);
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
      const response = await changePasswordService(
        currentPassword,
        newPassword
      );
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Error cambiando contraseña",
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
    loginWithGoogle,
    logout,
    getAccessToken,
    changePassword,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
