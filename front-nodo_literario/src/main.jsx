import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { createRoot } from "react-dom/client";
import React from "react";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
