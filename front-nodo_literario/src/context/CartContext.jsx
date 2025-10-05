import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Contexto y Hook
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// 3. Proveedor del Carrito (CartProvider)
export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    cantidadTotal: 0,
    carritoId: null,
  });
  const [loading, setLoading] = useState(false);

  // Cargar carrito al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  // Generar session ID para usuarios no logueados
  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  // Traer o crear carrito
  const getOrCreateCart = async () => {
    try {
      let sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        // Crear nuevo session ID
        sessionId = generateSessionId();
        localStorage.setItem("sessionId", sessionId);

        console.log("🆕 Creando nuevo carrito con sessionId:", sessionId);

        // Crear nuevo carrito con el session_id
        const response = await api.post("/carrito", {
          session_id: sessionId,
        });

        const nuevoCarrito = response.data;
        localStorage.setItem("carritoId", nuevoCarrito.id);
        console.log("✅ Nuevo carrito creado:", nuevoCarrito.id);
      } else {
        console.log("🔍 Usando sessionId existente:", sessionId);
      }

      return sessionId;
    } catch (error) {
      console.error("❌ Error al obtener/crear carrito:", error);
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

      console.log("🔄 Cargando carrito con sessionId:", sessionId);

      if (sessionId) {
        const response = await api.get(`/carrito`, {
          params: {
            session_id: sessionId,
          },
        });

        console.log("✅ Carrito cargado:", response.data);
        const carritoData = response.data;
        updateCartState(carritoData);
      }
    } catch (error) {
      console.error("❌ Error cargando carrito:", error);
      // Si es error 404, podría significar que el carrito fue eliminado
      // Podemos crear uno nuevo automáticamente
      if (error.response?.status === 404) {
        console.log("🔄 Carrito no encontrado, creando uno nuevo...");
        localStorage.removeItem("sessionId"); // Forzar recreación
        await loadCart(); // Recargar
      }
    } finally {
      setLoading(false);
    }
  };
  // Agregar item al carrito
  const addToCart = async (libro, cantidad = 1) => {
    try {
      setLoading(true);

      // PRIMERO cargar el carrito para obtener el ID
      await loadCart();
      const carritoId = cart.carritoId;

      console.log("🛒 Agregando al carrito:", {
        carritoId: carritoId,
        libroId: libro.id,
        cantidad: cantidad,
      });

      if (!carritoId) {
        throw new Error("No se pudo obtener el carrito");
      }

      const response = await api.post("/carrito/agregar", {
        id_carrito: carritoId,
        id_libro: libro.id,
        cantidad: cantidad,
      });

      // Recargar el carrito para reflejar los cambios
      await loadCart();
      return { success: true };
    } catch (error) {
      console.error(
        "Error agregando al carrito:",
        error.response?.data?.error || error.message
      );
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

      // Usar el ID del carrito del estado, no crear uno nuevo
      const carritoId = cart.carritoId;

      console.log("🗑️ Removiendo del carrito:", {
        carritoId: carritoId,
        libroId: idLibro,
      });

      const response = await api.delete("/carrito/remover", {
        data: {
          id_carrito: carritoId,
          id_libro: idLibro,
        },
      });

      await loadCart();
      return { success: true };
    } catch (error) {
      console.error(
        "Error removiendo del carrito:",
        error.response?.data?.error || error.message
      );
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

    try {
      setLoading(true);
      const carritoId = await getOrCreateCart();

      await removeFromCart(idLibro);

      // Buscar el libro para agregarlo con la nueva cantidad
      const itemToUpdate = cart.items.find((item) => item.id_libro === idLibro);

      if (itemToUpdate) {
        // Se asume que el objeto `itemToUpdate` contiene la info completa del libro
        const libro = itemToUpdate.libro || { id: idLibro }; // Fallback si no tiene el objeto libro
        return await addToCart(libro, nuevaCantidad);
      }

      return { success: false, error: "Libro no encontrado" };
    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      return { success: false, error: "Error de conexión" };
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);

      // Usar el ID del carrito del estado
      const carritoId = cart.carritoId;

      console.log("🧹 Vaciando carrito:", carritoId);

      const response = await api.delete("/carrito/vaciar", {
        data: {
          id_carrito: carritoId,
        },
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
      console.error(
        "Error vaciando carrito:",
        error.response?.data?.error || error.message
      );
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
