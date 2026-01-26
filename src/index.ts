import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'
import compression from 'compression'

// Configuración de Prisma
import { connectDB } from './config/database'

// Rutas
import { getExercisesRoutes } from './routes/exercisesRoutes'
import { getWorkoutsRoutes } from './routes/workoutsRoutes'
import { getProgressRoutes } from './routes/progressRoutes'
import { getRoutinesRoutes } from './routes/routinesRoutes'
import { getAuthRoutes } from './routes/authRoutes'
import { getUserRoutes } from './routes/userRoutes'
import { getMeasurementRoutes } from './routes/measurementsRoutes'
import { getDashboardRoutes } from './routes/dashboardRoutes'
import { getGoalRoutes } from './routes/goalRoutes'
import { getAIRoutes } from './routes/aiRoutes'
import { getStreakRoutes } from './routes/streakRoutes'

// ================= CONFIG =================
dotenv.config()

const app: Application = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
})

const PORT = process.env.PORT || 3000

// ================= MIDDLEWARES =================
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ================= ROUTES =================
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Forgy Backend API',
    version: '1.0.0',
    status: 'Running',
  })
})

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
})

// ========== RUTAS PÚBLICAS ==========
app.use('/api/auth', getAuthRoutes())
app.use('/api/exercises', getExercisesRoutes())

// ========== RUTAS PROTEGIDAS ==========
app.use('/api/user', getUserRoutes())
app.use('/api/routines', getRoutinesRoutes())
app.use('/api/streak', getStreakRoutes())
app.use('/api/workouts', getWorkoutsRoutes())
app.use('/api/progress', getProgressRoutes())
app.use('/api/measurements', getMeasurementRoutes())
app.use('/api/dashboard', getDashboardRoutes())
app.use('/api/goals', getGoalRoutes())
app.use('/api/ai', getAIRoutes())

// ================= WEBSOCKET =================
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`)
  })
})

// ================= ERROR HANDLERS =================

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.path,
  })
})

// Global error handler
app.use(
  (err: Error, req: Request, res: Response, _next: any) => {
    console.error('Error:', err)

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined,
    })
  }
)

// ================= START SERVER =================
httpServer.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  await connectDB()
})