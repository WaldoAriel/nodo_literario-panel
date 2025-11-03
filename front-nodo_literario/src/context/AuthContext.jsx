import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  login as loginService,
  register as registerService,
  getProfile,
  changePassword as changePasswordService,
} from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const profile = await getProfile();
      setUser(profile.usuario);
    } catch (error) {
      console.error('Error en checkAuthStatus:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = (response) => {
    setUser({
      ...response.usuario,
      tipo: response.esAdministrador ? "administrador" : "cliente",
      rol: response.rol,
    });

    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
    return { success: true, data: response };
  };

  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      return handleSuccessfulLogin(response);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error en el registro",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      return handleSuccessfulLogin(response);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error en el login",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

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

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
