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

        {/* Rutas de Administración - Envueltas en AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/libros"
          element={
            <AdminLayout>
              <AdminLibros />
            </AdminLayout>
          }
        />
        {/* rutas para autores y categorías */}
        <Route
          path="/admin/autores"
          element={
            <AdminLayout>
              <AdminAutores />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <AdminLayout>
              <AdminCategorias />
            </AdminLayout>
          }
        />
      </Routes>
      {!esRutaAdmin && <Footer />}
    </>
  );
}

export default AppRoutes;
