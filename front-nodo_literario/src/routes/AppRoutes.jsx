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
import AdminLibros from "../pages/Admin/AdminLibros";

function AppRoutes() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!esRutaAdmin && <NavBar />}{" "}
      {/* Se renderiza navbar solo si esRutaAdmin es false */}
      <Routes>
        {/* Página Principal */}
        <Route path="/" element={<Home />} />

        {/* Libros */}
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="catalogo/categoria/:id_categoria" element={<Catalogo />} />
        <Route path="categorias" element={<Categorias />}></Route>
        <Route path="/libro/:id" element={<DetalleLibro />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Carrito  (falta implementar)*/}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Autenticación (falta implementar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Panel de Administración */}
        <Route path="/admin/libros" element={<AdminLibros />} />
      </Routes>
      {!esRutaAdmin && <Footer />}{" "}
      {/* Se renderiza footer solo si esRutaAdmin es false */}
    </>
  );
}

export default AppRoutes;
