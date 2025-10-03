import { Usuario, Cliente, Administrador, sequelize } from './src/models/index.js';

async function testRelationsSafe() {
  try {
    console.log('🧪 TEST SEGURO - Usando estructura actual de BD...\n');

    const timestamp = Date.now();
    const uniqueEmail = `test${timestamp}@nodo-literario.com`;

    // 1. Crear usuario (esto SABEMOS que funciona)
    console.log('1. Creando usuario...');
    const usuario = await Usuario.create({
      email: uniqueEmail,
      password_hash: 'password_temporal_123',
      nombre: 'María',
      apellido: 'García',
      telefono: '1122334455'
    });
    console.log('✅ Usuario creado ID:', usuario.id);

    // 2. Crear cliente con datos DUPLICADOS (estructura actual)
    console.log('\n2. Creando cliente (datos duplicados)...');
    const cliente = await Cliente.create({
      id_usuario: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido, 
      email: usuario.email,
      telefono: usuario.telefono
    });
    console.log('✅ Cliente creado ID:', cliente.id);

    // 3. Probar solo la relación más simple
    console.log('\n3. Probando relación básica...');
    const usuarioConCliente = await Usuario.findByPk(usuario.id);
    console.log('✅ Usuario existe:', usuarioConCliente.email);

    console.log('\n🎉 PRUEBA SEGURA EXITOSA!');
    console.log('📝 Mañana normalizaremos gradualmente');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión cerrada.');
  }
}

testRelationsSafe();