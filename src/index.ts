import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import { getExercisesRoutes } from './routes/exercisesRoutes';
import { getWorkoutsRoutes } from './routes/workoutsRoutes';
import { getProgressRoutes } from './routes/progressRoutes';
import { getMeasurementsRoutes } from './routes/measurementsRoutes';

// Data (para el log de inicio)
import { exercisesDB } from './data/exercisesData';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('🏋️ API Forgy - Plataforma de Ejercicios');
});

app.use('/exercises', getExercisesRoutes());
app.use('/workouts', getWorkoutsRoutes());
app.use('/progress', getProgressRoutes());
app.use('/measurements', getMeasurementsRoutes());

// Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);
    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado:', socket.id);
    });
});

// Exportar io para usar en controllers si se necesita
export { io };

// Start server
server.listen(PORT, () => {
    console.log(`🏋️ Servidor Forgy corriendo en http://localhost:${PORT}`);
    console.log(`📊 ${exercisesDB.length} ejercicios cargados`);
});