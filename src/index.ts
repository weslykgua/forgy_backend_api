import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'

// Configuración de Prisma
import { connectDB } from './config/database'
import { getExercisesRoutes } from './routes/exercisesRoutes'
import { getWorkoutsRoutes } from './routes/workoutsRoutes'
import { getProgressRoutes } from './routes/progressRoutes'
import { getRoutinesRoutes } from './routes/routinesRoutes'

// Cargar variables de entorno
dotenv.config()

// Crear app Express
const app: Application = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Permitir cualquier origen en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
})

// Puerto
const PORT = process.env.PORT || 3000

// ========== MIDDLEWARES ==========
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })) // Seguridad
app.use(compression()) // Compresión GZIP
app.use(morgan('dev')) // Logs de requests
app.use(cors()) // CORS
app.use(express.json()) // Parse JSON
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded

// Registrar rutas
app.get('/', (req, res) => {
  res.json({
    name: 'Forgy Backend API',
    version: '1.0.0',
    status: 'Running'
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/exercises', getExercisesRoutes)
app.use('/routines', getRoutinesRoutes)
app.use('/workouts', getWorkoutsRoutes)
app.use('/progress', getProgressRoutes)

// ========== WEBSOCKET ==========
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`)
  })
})

// ========== ERROR HANDLERS ==========

// 404 - Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.path,
  })
})

// Error handler global
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  connectDB()
})