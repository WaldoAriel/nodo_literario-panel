import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

// Extrae las variables de entorno
const dbName = process.env.DB_NAME || 'simulacro';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '1234';
const dbHost = process.env.DB_HOST || 'localhost';
const dbDialect = process.env.DB_DIALECT || 'mysql';
const dbPort = process.env.DB_PORT || 3306;

// Crea una instancia de Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    port: dbPort,
    logging: false, // Desactiva los logs SQL
});

// Exporta la instancia para usarla en otros lugares
export default sequelize;