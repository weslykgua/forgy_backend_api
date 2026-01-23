"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
// Configuración de Prisma
const database_1 = require("./config/database");
const exercisesRoutes_1 = require("./routes/exercisesRoutes");
const workoutsRoutes_1 = require("./routes/workoutsRoutes");
const progressRoutes_1 = require("./routes/progressRoutes");
const routinesRoutes_1 = require("./routes/routinesRoutes");
// Cargar variables de entorno
dotenv_1.default.config();
// Crear app Express
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // Permitir cualquier origen en desarrollo
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
});
// Puerto
const PORT = process.env.PORT || 3000;
// ========== MIDDLEWARES ==========
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // Seguridad
app.use((0, compression_1.default)()); // Compresión GZIP
app.use((0, morgan_1.default)('dev')); // Logs de requests
app.use((0, cors_1.default)()); // CORS
app.use(express_1.default.json()); // Parse JSON
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded
// Registrar rutas
app.get('/', (req, res) => {
    res.json({
        name: 'Forgy Backend API',
        version: '1.0.0',
        status: 'Running'
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.use('/exercises', exercisesRoutes_1.getExercisesRoutes);
app.use('/routines', routinesRoutes_1.getRoutinesRoutes);
app.use('/workouts', workoutsRoutes_1.getWorkoutsRoutes);
app.use('/progress', progressRoutes_1.getProgressRoutes);
// ========== WEBSOCKET ==========
io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});
// ========== ERROR HANDLERS ==========
// 404 - Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.path,
    });
});
// Error handler global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    (0, database_1.connectDB)();
});
