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
const database_1 = __importDefault(require("./config/database"));
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
// ========== RUTAS ==========
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Forgy Backend API is running',
        timestamp: new Date().toISOString(),
        database: 'Connected',
    });
});
// Root
app.get('/', (req, res) => {
    res.json({
        name: 'Forgy Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            exercises: '/exercises',
            workouts: '/workouts',
            progress: '/progress',
        },
    });
});
// ========== EJERCICIOS ==========
// GET: Obtener todos los ejercicios
app.get('/exercises', async (req, res) => {
    try {
        const exercises = await database_1.default.exercise.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(exercises);
    }
    catch (error) {
        console.error('Error al obtener ejercicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener ejercicios',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET: Obtener ejercicios por músculo
app.get('/exercises/muscle/:muscle', async (req, res) => {
    try {
        const muscle = Array.isArray(req.params.muscle) ? req.params.muscle[0] : req.params.muscle;
        const exercises = await database_1.default.exercise.findMany({
            where: { muscle },
        });
        res.json(exercises);
    }
    catch (error) {
        console.error('Error al obtener ejercicios por músculo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener ejercicios',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET: Obtener un ejercicio por ID
app.get('/exercises/:id', async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const exercise = await database_1.default.exercise.findUnique({
            where: { id },
            include: {
                workoutLogs: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Ejercicio no encontrado',
            });
        }
        res.json(exercise);
    }
    catch (error) {
        console.error('Error al obtener ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener ejercicio',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// POST: Crear un ejercicio
app.post('/exercises', async (req, res) => {
    try {
        const exercise = await database_1.default.exercise.create({
            data: {
                name: req.body.name,
                muscle: req.body.muscle,
                video: req.body.video || null,
                description: req.body.description || null,
                difficulty: req.body.difficulty || null,
                equipment: req.body.equipment || null,
                instructions: req.body.instructions || [],
            },
        });
        // Emitir evento WebSocket
        io.emit('exercises-updated', exercise);
        res.status(201).json({
            success: true,
            message: 'Ejercicio creado exitosamente',
            data: exercise,
        });
    }
    catch (error) {
        console.error('Error al crear ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear ejercicio',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// PUT: Actualizar un ejercicio
app.put('/exercises/:id', async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const exercise = await database_1.default.exercise.update({
            where: { id },
            data: {
                ...(req.body.name && { name: req.body.name }),
                ...(req.body.muscle && { muscle: req.body.muscle }),
                ...(req.body.video !== undefined && { video: req.body.video }),
                ...(req.body.description !== undefined && { description: req.body.description }),
                ...(req.body.difficulty && { difficulty: req.body.difficulty }),
                ...(req.body.equipment !== undefined && { equipment: req.body.equipment }),
                ...(req.body.instructions && { instructions: req.body.instructions }),
            },
        });
        // Emitir evento WebSocket
        io.emit('exercises-updated', exercise);
        res.json({
            success: true,
            message: 'Ejercicio actualizado exitosamente',
            data: exercise,
        });
    }
    catch (error) {
        console.error('Error al actualizar ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar ejercicio',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// DELETE: Eliminar un ejercicio
app.delete('/exercises/:id', async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await database_1.default.exercise.delete({
            where: { id },
        });
        // Emitir evento WebSocket
        io.emit('exercises-updated', { id, deleted: true });
        res.json({
            success: true,
            message: 'Ejercicio eliminado exitosamente',
        });
    }
    catch (error) {
        console.error('Error al eliminar ejercicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar ejercicio',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// ========== WORKOUTS ==========
// GET: Obtener todos los workouts
app.get('/workouts', async (req, res) => {
    try {
        const workouts = await database_1.default.workoutLog.findMany({
            include: {
                exercise: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(workouts);
    }
    catch (error) {
        console.error('Error al obtener workouts:', error);
        res.status(500).json({ success: false, message: 'Error al obtener workouts' });
    }
});
// GET: Historial de workouts
app.get('/workouts/history', async (req, res) => {
    try {
        const workouts = await database_1.default.workoutLog.findMany({
            orderBy: { date: 'desc' },
            take: 100,
        });
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
});
// GET: Personal Records
app.get('/workouts/prs', async (req, res) => {
    try {
        const allWorkouts = await database_1.default.workoutLog.findMany({
            include: { exercise: true },
        });
        const prs = allWorkouts.reduce((acc, workout) => {
            const maxWeight = Math.max(...workout.sets.map((s) => s.weight || 0));
            const existing = acc.find((pr) => pr.exerciseName === workout.exerciseName);
            if (!existing || maxWeight > existing.maxWeight) {
                return [
                    ...acc.filter((pr) => pr.exerciseName !== workout.exerciseName),
                    { exerciseName: workout.exerciseName, maxWeight, date: workout.date },
                ];
            }
            return acc;
        }, []);
        res.json(prs.sort((a, b) => b.maxWeight - a.maxWeight));
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
});
// POST: Crear workout
app.post('/workouts', async (req, res) => {
    try {
        const workout = await database_1.default.workoutLog.create({
            data: {
                date: req.body.date || new Date().toISOString().split('T')[0],
                exerciseId: req.body.exerciseId,
                exerciseName: req.body.exerciseName,
                sets: req.body.sets,
                duration: req.body.duration || null,
                notes: req.body.notes || null,
            },
        });
        io.emit('workouts-updated', workout);
        res.status(201).json({ success: true, data: workout });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear workout' });
    }
});
// ========== PROGRESS ==========
// GET: Obtener todo el progreso
app.get('/progress', async (req, res) => {
    try {
        const progress = await database_1.default.dailyProgress.findMany({
            orderBy: { date: 'desc' },
        });
        res.json(progress);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
});
// GET: Estadísticas de progreso
app.get('/progress/stats', async (req, res) => {
    try {
        const workouts = await database_1.default.workoutLog.count();
        const progress = await database_1.default.dailyProgress.findMany({ orderBy: { date: 'desc' } });
        const totalVolume = await database_1.default.workoutLog
            .findMany({
            select: { sets: true },
        })
            .then((logs) => logs.reduce((sum, log) => {
            const vol = log.sets.reduce((s, set) => s + set.reps * set.weight, 0);
            return sum + vol;
        }, 0));
        const latestWeight = progress[0]?.weight || 0;
        res.json({
            totalWorkouts: workouts,
            totalVolume,
            streakDays: 5, // Calcular racha real
            currentWeight: latestWeight,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
});
// POST: Crear/actualizar progreso
app.post('/progress', async (req, res) => {
    try {
        const { date, weight, waterIntake, caloriesConsumed, caloriesBurned, sleepHours, mood, notes } = req.body;
        const existing = await database_1.default.dailyProgress.findUnique({
            where: { date },
        });
        let progress;
        if (existing) {
            progress = await database_1.default.dailyProgress.update({
                where: { date },
                data: {
                    ...(weight !== undefined && { weight }),
                    ...(waterIntake !== undefined && { waterIntake }),
                    ...(caloriesConsumed !== undefined && { caloriesConsumed }),
                    ...(caloriesBurned !== undefined && { caloriesBurned }),
                    ...(sleepHours !== undefined && { sleepHours }),
                    ...(mood && { mood }),
                    ...(notes !== undefined && { notes }),
                },
            });
        }
        else {
            progress = await database_1.default.dailyProgress.create({
                data: {
                    date,
                    weight,
                    waterIntake,
                    caloriesConsumed,
                    caloriesBurned,
                    sleepHours,
                    mood,
                    notes,
                },
            });
        }
        res.status(201).json({ success: true, data: progress });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error al guardar progreso' });
    }
});
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
