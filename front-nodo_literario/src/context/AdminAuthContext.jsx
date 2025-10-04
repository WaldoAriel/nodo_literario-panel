import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Crear el contexto
const AdminAuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminTokens, setAdminTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    checkAdminAuthStatus();
  }, []);

  const checkAdminAuthStatus = async () => {
    try {
      const savedTokens = getStoredAdminTokens();
      if (savedTokens) {
        setAdminTokens(savedTokens);
        
        // Decodificar token para obtener info del admin
        const tokenData = JSON.parse(atob(savedTokens.accessToken.split('.')[1]));
        if (tokenData.tipo === 'administrador') {
          setAdmin({
            id: tokenData.userId,
            email: tokenData.email,
            tipo: tokenData.tipo,
            rol: tokenData.rol
          });
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación de admin:', error);
      adminLogout();
    } finally {
      setLoading(false);
    }
  };

  const getStoredAdminTokens = () => {
    try {
      const stored = localStorage.getItem('adminAuthTokens');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  };

  const storeAdminTokens = (newTokens) => {
    localStorage.setItem('adminAuthTokens', JSON.stringify(newTokens));
    setAdminTokens(newTokens);
  };

  const clearAdminTokens = () => {
    localStorage.removeItem('adminAuthTokens');
    setAdminTokens(null);
  };

  const adminLogin = (tokens, adminData) => {
    storeAdminTokens(tokens);
    setAdmin(adminData);
  };

  const adminLogout = () => {
    clearAdminTokens();
    setAdmin(null);
  };

  const getAdminAccessToken = () => {
    return adminTokens?.accessToken || null;
  };

  const value = {
    admin,
    adminTokens,
    loading,
    isAdminAuthenticated: !!admin,
    adminLogin,
    adminLogout,
    getAdminAccessToken
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;