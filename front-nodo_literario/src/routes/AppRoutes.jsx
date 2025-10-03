import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import NavBar from "../components/NavBar";
import Catalogo from "../pages/Libros/Catalogo";
import DetalleLibro from "../pages/Libros/DetalleLibro";
import Carrito from "../pages/Cart/Carrito";
import Checkout from "../pages/Cart/Checkout";
import Login from "../pages/Auth/Login";
import Registro from "../pages/Auth/Registro";
import Contacto from "../pages/Contacto";
import Footer from "../components/Footer";
import Categorias from "../pages/Libros/Categorias";
import AdminLibros from "../admin/pages/AdminLibros";
// componentes nuevos
import AdminLayout from "../admin/components/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
// componentes de autores y categorías
import AdminAutores from "../admin/pages/AdminAutores";
import AdminCategorias from "../admin/pages/AdminCategorias";
//Importar ProtectedRoute
import ProtectedRoute from "../components/ProtectedRoute";
import { Box, Typography } from "@mui/material";

function AppRoutes() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!esRutaAdmin && <NavBar />}
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="catalogo/categoria/:id_categoria" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="/libro/:id" element={<DetalleLibro />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas de Administración - PROTEGIDAS */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/libros"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminLibros />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* rutas para autores y categorías */}
        <Route
          path="/admin/autores"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAutores />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCategorias />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Ruta para páginas no encontradas */}
        <Route 
          path="*" 
          element={
            <Box sx={{ textAlign: 'center', padding: 4, marginTop: 4 }}>
              <Typography variant="h4" gutterBottom>
                Página No Encontrada
              </Typography>
              <Typography variant="body1" color="text.secondary">
                La página que buscas no existe.
              </Typography>
            </Box>
          } 
        />
      </Routes>
      {!esRutaAdmin && <Footer />}
    </>
  );
}

export default AppRoutes;