"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const client_1 = require("@prisma/client");
/**
 * Singleton de PrismaClient
 * En desarrollo, usar global para hot-reload sin crear múltiples conexiones
 * En producción, crear una nueva instancia
 */
const prisma = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
/**
 * Conectar a la base de datos
 */
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conectado a la base de datos PostgreSQL');
    }
    catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
/**
 * Desconectar de la base de datos
 */
const disconnectDB = async () => {
    await prisma.$disconnect();
    console.log('👋 Desconectado de la base de datos');
};
exports.disconnectDB = disconnectDB;
// Manejar cierre de la aplicación
process.on('beforeExit', async () => {
    await (0, exports.disconnectDB)();
});
exports.default = prisma;
