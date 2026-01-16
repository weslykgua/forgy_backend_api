import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { getExercisesRoutes } from './routes/exercisesRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/exercises', getExercisesRoutes());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// ==================== INTERFACES ====================


interface WorkoutLog {
    id: string;
    date: string; // YYYY-MM-DD
    exerciseId: string;
    exerciseName: string;
    sets: { reps: number; weight: number; completed: boolean }[];
    duration: number; // minutos
    notes: string;
    createdAt: string;
}

interface DailyProgress {
    id: string;
    date: string; // YYYY-MM-DD
    weight: number; // kg
    waterIntake: number; // ml
    caloriesConsumed: number;
    caloriesBurned: number;
    sleepHours: number;
    mood: 'Excelente' | 'Bien' | 'Regular' | 'Mal';
    notes: string;
    createdAt: string;
}

interface BodyMeasurement {
    id: string;
    date: string;
    chest: number;
    waist: number;
    hips: number;
    bicepLeft: number;
    bicepRight: number;
    thighLeft: number;
    thighRight: number;
    createdAt: string;
}

// ==================== DATABASES ====================

let workoutLogsDB: WorkoutLog[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        exerciseId: '1',
        exerciseName: 'Press Banca',
        sets: [
            { reps: 12, weight: 60, completed: true },
            { reps: 10, weight: 70, completed: true },
            { reps: 8, weight: 80, completed: true }
        ],
        duration: 15,
        notes: 'Buen entrenamiento',
        createdAt: new Date().toISOString()
    }
];

let dailyProgressDB: DailyProgress[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        weight: 75,
        waterIntake: 2500,
        caloriesConsumed: 2200,
        caloriesBurned: 500,
        sleepHours: 7,
        mood: 'Bien',
        notes: 'Día productivo',
        createdAt: new Date().toISOString()
    }
];

let bodyMeasurementsDB: BodyMeasurement[] = [];

// ==================== HELPERS ====================


const getProgressStats = () => {
    const totalWorkouts = workoutLogsDB.length;
    const totalVolume = workoutLogsDB.reduce((acc, log) => {
        return acc + log.sets.reduce((setAcc, set) => setAcc + (set.reps * set.weight), 0);
    }, 0);

    const avgWater = dailyProgressDB.length > 0
        ? dailyProgressDB.reduce((acc, p) => acc + p.waterIntake, 0) / dailyProgressDB.length
        : 0;

    // Ordenar por fecha y obtener historial de peso (solo donde hay peso registrado)
    const weightHistory = dailyProgressDB
        .filter(p => p.weight && p.weight > 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(p => ({ date: p.date, weight: p.weight }));

    // Calcular racha de días
    const today = new Date();
    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasActivity = workoutLogsDB.some(w => w.date === dateStr) ||
            dailyProgressDB.some(p => p.date === dateStr);
        if (hasActivity) {
            streakDays++;
        } else if (i > 0) {
            break;
        }
    }

    return {
        totalWorkouts,
        totalVolume: Math.round(totalVolume),
        avgWater: Math.round(avgWater),
        weightHistory,
        currentWeight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0,
        streakDays
    };
};

// Obtener Records Personales (PRs)
const getPersonalRecords = () => {
    const prs: { [exerciseId: string]: { exerciseName: string; maxWeight: number; maxVolume: number; date: string } } = {};

    workoutLogsDB.forEach(workout => {
        const maxSetWeight = Math.max(...workout.sets.map(s => s.weight));
        const workoutVolume = workout.sets.reduce((acc, s) => acc + (s.reps * s.weight), 0);

        if (!prs[workout.exerciseId] || maxSetWeight > prs[workout.exerciseId].maxWeight) {
            prs[workout.exerciseId] = {
                exerciseName: workout.exerciseName,
                maxWeight: maxSetWeight,
                maxVolume: workoutVolume,
                date: workout.date
            };
        }
    });

    return Object.values(prs).sort((a, b) => b.maxWeight - a.maxWeight);
};

// Obtener historial de entrenamientos agrupado
const getWorkoutHistory = () => {
    const grouped: { [date: string]: { workouts: WorkoutLog[]; totalVolume: number; totalDuration: number } } = {};

    workoutLogsDB.forEach(workout => {
        if (!grouped[workout.date]) {
            grouped[workout.date] = { workouts: [], totalVolume: 0, totalDuration: 0 };
        }
        grouped[workout.date].workouts.push(workout);
        grouped[workout.date].totalVolume += workout.sets.reduce((acc, s) => acc + (s.reps * s.weight), 0);
        grouped[workout.date].totalDuration += workout.duration;
    });

    return Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 30)
        .map(([date, data]) => ({
            date,
            exerciseCount: data.workouts.length,
            totalVolume: Math.round(data.totalVolume),
            totalDuration: data.totalDuration,
            workouts: data.workouts
        }));
};

// ==================== ROUTES ====================
app.get('/', (req: Request, res: Response) => {
    res.send('🏋️ API Forgy - Plataforma de Ejercicios');
});

// ========== EXERCISES ==========


// ========== WORKOUT LOGS ==========
app.get('/workouts', (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;
    let filtered = [...workoutLogsDB];

    if (date) {
        filtered = filtered.filter(w => w.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter(w => w.date >= startDate && w.date <= endDate);
    }
    res.json(filtered);
});

app.get('/workouts/history', (req: Request, res: Response) => {
    res.json(getWorkoutHistory());
});

app.get('/workouts/prs', (req: Request, res: Response) => {
    res.json(getPersonalRecords());
});

app.get('/workouts/calendar', (req: Request, res: Response) => {
    const { month, year } = req.query;
    const workoutDates = workoutLogsDB.map(w => w.date);
    const progressDates = dailyProgressDB.map(p => p.date);

    const calendar: { [date: string]: { hasWorkout: boolean; hasProgress: boolean } } = {};

    workoutDates.forEach(d => {
        if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasWorkout = true;
    });

    progressDates.forEach(d => {
        if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasProgress = true;
    });

    res.json(calendar);
});

app.get('/workouts/:id', (req: Request, res: Response) => {
    const workout = workoutLogsDB.find(w => w.id === req.params.id);
    if (!workout) return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    res.json(workout);
});

app.post('/workouts', (req: Request, res: Response) => {
    const newWorkout: WorkoutLog = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        exerciseId: req.body.exerciseId,
        exerciseName: req.body.exerciseName,
        sets: req.body.sets || [],
        duration: req.body.duration || 0,
        notes: req.body.notes || '',
        createdAt: new Date().toISOString()
    };
    workoutLogsDB.push(newWorkout);
    io.emit('workouts-updated');
    res.status(201).json(newWorkout);
});

app.put('/workouts/:id', (req: Request, res: Response) => {
    const index = workoutLogsDB.findIndex(w => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' });

    workoutLogsDB[index] = { ...workoutLogsDB[index], ...req.body };
    io.emit('workouts-updated');
    res.json(workoutLogsDB[index]);
});

app.delete('/workouts/:id', (req: Request, res: Response) => {
    const index = workoutLogsDB.findIndex(w => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' });

    const deleted = workoutLogsDB.splice(index, 1)[0];
    io.emit('workouts-updated');
    res.json({ message: 'Entrenamiento eliminado', workout: deleted });
});

// ========== DAILY PROGRESS ==========
app.get('/progress', (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;
    let filtered = [...dailyProgressDB];

    if (date) {
        filtered = filtered.filter(p => p.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter(p => p.date >= startDate && p.date <= endDate);
    }
    res.json(filtered);
});

app.get('/progress/stats', (req: Request, res: Response) => {
    res.json(getProgressStats());
});

app.get('/progress/:date', (req: Request, res: Response) => {
    const progress = dailyProgressDB.find(p => p.date === req.params.date);
    if (!progress) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(progress);
});

app.post('/progress', (req: Request, res: Response) => {
    const existingIndex = dailyProgressDB.findIndex(p => p.date === req.body.date);

    if (existingIndex !== -1) {
        // Actualizar si ya existe para esa fecha
        dailyProgressDB[existingIndex] = { ...dailyProgressDB[existingIndex], ...req.body };
        io.emit('progress-updated');
        return res.json(dailyProgressDB[existingIndex]);
    }

    const newProgress: DailyProgress = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        weight: req.body.weight || 0,
        waterIntake: req.body.waterIntake || 0,
        caloriesConsumed: req.body.caloriesConsumed || 0,
        caloriesBurned: req.body.caloriesBurned || 0,
        sleepHours: req.body.sleepHours || 0,
        mood: req.body.mood || 'Bien',
        notes: req.body.notes || '',
        createdAt: new Date().toISOString()
    };
    dailyProgressDB.push(newProgress);
    io.emit('progress-updated');
    res.status(201).json(newProgress);
});

app.delete('/progress/:id', (req: Request, res: Response) => {
    const index = dailyProgressDB.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Registro no encontrado' });

    const deleted = dailyProgressDB.splice(index, 1)[0];
    io.emit('progress-updated');
    res.json({ message: 'Registro eliminado', progress: deleted });
});

// ========== BODY MEASUREMENTS ==========
app.get('/measurements', (req: Request, res: Response) => {
    res.json(bodyMeasurementsDB);
});

app.post('/measurements', (req: Request, res: Response) => {
    const newMeasurement: BodyMeasurement = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        chest: req.body.chest || 0,
        waist: req.body.waist || 0,
        hips: req.body.hips || 0,
        bicepLeft: req.body.bicepLeft || 0,
        bicepRight: req.body.bicepRight || 0,
        thighLeft: req.body.thighLeft || 0,
        thighRight: req.body.thighRight || 0,
        createdAt: new Date().toISOString()
    };
    bodyMeasurementsDB.push(newMeasurement);
    io.emit('measurements-updated');
    res.status(201).json(newMeasurement);
});

// ========== SOCKET.IO ==========
io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);
    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🏋️ Servidor Forgy corriendo en http://localhost:${PORT}`);
    console.log(`📊 ${exercisesDB.length} ejercicios cargados`);
});