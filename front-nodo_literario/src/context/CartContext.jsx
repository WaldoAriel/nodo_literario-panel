import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    cantidadTotal: 0,
    carritoId: null,
  });
  const [loading, setLoading] = useState(false);

  // Generar session ID para usuarios no logueados
  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  // Traer o crear carrito
  const getOrCreateCart = async () => {
    try {
      let sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem("sessionId", sessionId);

        const response = await api.post("/carrito", {
          session_id: sessionId,
        });

        const nuevoCarrito = response.data;
        localStorage.setItem("carritoId", nuevoCarrito.id);
      }

      return sessionId;
    } catch (error) {
      console.error("Error al obtener/crear carrito:", error);
      return null;
    }
  };

  // Actualizar estado local del carrito
  const updateCartState = (carritoData) => {
    if (carritoData && carritoData.items) {
      const total = carritoData.items.reduce(
        (sum, item) => sum + parseFloat(item.subtotal),
        0
      );
      const cantidadTotal = carritoData.items.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );

      setCart({
        items: carritoData.items,
        total,
        cantidadTotal,
        carritoId: carritoData.id,
      });
    }
  };

  // Cargar carrito desde la API
  const loadCart = async () => {
    try {
      setLoading(true);
      const sessionId = await getOrCreateCart();

      if (sessionId) {
        const response = await api.get(`/carrito`, {
          params: { session_id: sessionId },
        });
        const carritoData = response.data;
        updateCartState(carritoData);
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
      if (error.response?.status === 404) {
        localStorage.removeItem("sessionId");
        await loadCart();
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Agregar item al carrito
  const addToCart = async (libro, cantidad = 1) => {
    try {
      setLoading(true);
      await loadCart();
      const carritoId = cart.carritoId;

      if (!carritoId) {
        throw new Error("No se pudo obtener el carrito");
      }

      await api.post("/carrito/agregar", {
        id_carrito: carritoId,
        id_libro: libro.id,
        cantidad: cantidad,
      });

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error("Error agregando al carrito:", error.response?.data?.error || error.message);
      return {
        success: false,
        error: error.response?.data?.error || "Error de conexión",
      };
    } finally {
      setLoading(false);
    }
  };

  // Remover item del carrito
  const removeFromCart = async (idLibro) => {
    try {
      setLoading(true);
      const carritoId = cart.carritoId;

      await api.delete("/carrito/remover", {
        data: {
          id_carrito: carritoId,
          id_libro: idLibro,
        },
      });

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error("Error removiendo del carrito:", error.response?.data?.error || error.message);
      return {
        success: false,
        error: error.response?.data?.error || "Error de conexión",
      };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un item
  const updateQuantity = async (idLibro, nuevaCantidad) => {
  if (nuevaCantidad <= 0) {
    return await removeFromCart(idLibro);
  }

  let carritoAnterior;

  try {
    carritoAnterior = { ...cart };
    const carritoId = cart.carritoId;

    // Actualización local inmediata
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.id_libro === idLibro 
          ? { 
              ...item, 
              cantidad: nuevaCantidad,
              subtotal: item.precio_unitario * nuevaCantidad
            } 
          : item
      );

      const total = updatedItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      const cantidadTotal = updatedItems.reduce((sum, item) => sum + item.cantidad, 0);

      return {
        ...prevCart,
        items: updatedItems,
        total,
        cantidadTotal
      };
    });

    // Sincronizar con backend
    await api.put("/carrito/actualizar-cantidad", {
      id_carrito: carritoId,
      id_libro: idLibro,
      cantidad: nuevaCantidad,
    });

    return { success: true };
    
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    
    // Revertir en caso de error
    if (carritoAnterior) {
      setCart(carritoAnterior);
    } else {
      // Fallback: recargar el carrito desde el servidor
      await loadCart();
    }
    
    if (error.response?.status === 400 && error.response?.data?.error) {
      const errorMessage = error.response.data.error;
      
      if (errorMessage.includes('Stock insuficiente')) {
        return { 
          success: false, 
          error: errorMessage,
          stockDisponible: error.response.data.stockDisponible
        };
      }
    }
    
    return { 
      success: false, 
      error: error.response?.data?.error || "Error de conexión" 
    };
  }
};

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      const carritoId = cart.carritoId;

      await api.delete("/carrito/vaciar", {
        data: { id_carrito: carritoId },
      });

      // Actualizar estado local
      setCart({
        items: [],
        total: 0,
        cantidadTotal: 0,
        carritoId: carritoId,
      });
      return { success: true };
    } catch (error) {
      console.error("Error vaciando carrito:", error.response?.data?.error || error.message);
      return {
        success: false,
        error: error.response?.data?.error || "Error de conexión",
      };
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un libro está en el carrito
  const isInCart = (idLibro) => {
    return cart.items.some((item) => item.id_libro === idLibro);
  };

  // Obtener cantidad de un libro en el carrito
  const getItemQuantity = (idLibro) => {
    const item = cart.items.find((item) => item.id_libro === idLibro);
    return item ? item.cantidad : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    reloadCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}