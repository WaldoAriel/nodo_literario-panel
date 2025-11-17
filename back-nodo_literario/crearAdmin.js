import bcrypt from "bcryptjs";
import { Usuario, Administrador } from "./src/models/index.js";
import sequelize from "./src/db/connection.js";

const crearAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // Verifica si el usuario existe
    const existingUser = await Usuario.findOne({
      where: { email: "admin@nodoliterario.com" }   // mail
    });

    if (existingUser) {
      console.log("⚠️ El usuario admin ya existe. Verificando si es administrador...");
      
      const existingAdmin = await Administrador.findOne({
        where: { id_usuario: existingUser.id }
      });

      if (existingAdmin) {
        console.log("❌ Este usuario ya es administrador");
        process.exit(1);
      } else {
        // Crea administrador para usuario existente
        const administrador = await Administrador.create({
          id_usuario: existingUser.id,
          rol: "superadmin",
        });
        console.log("✅ Administrador creado para usuario existente");
        process.exit(0);
      }
    }

    // Crear usuario nuevo
    const password_hash = await bcrypt.hash("admin123", 12);
    const usuario = await Usuario.create({
      email: "admin@nodoliterario.com",             // mismo mail de arriba
      passwordHash: password_hash,
      nombre: "Administrador",                      // nombre
      apellido: "Principal",                        // apellido
      telefono: "+5493546511110",                   // telefono
    });

    console.log("✅ Usuario creado, ID:", usuario.id);

    // Crea administrador
    const administrador = await Administrador.create({
      id_usuario: usuario.id,
      rol: "superadmin",                            // rol admin
    });

    console.log("Administrador creado, ID:", administrador.id);
    console.log("Usuario administrador creado exitosamente!");
    console.log("Email: admin@nodoliterario.com");
    console.log("Password: admin123");
    console.log("Rol: superadmin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

crearAdmin();