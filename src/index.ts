import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

// Configuración de Prisma
import { connectDB } from './config/database'

// Rutas
import { getExercisesRoutes } from './routes/exercisesRoutes'
import { getWorkoutsRoutes } from './routes/workoutsRoutes'
import { getProgressRoutes } from './routes/progressRoutes'
import { getRoutinesRoutes } from './routes/routinesRoutes'
import { getAuthRoutes } from './routes/authRoutes'
import { getUserRoutes } from './routes/userRoutes'
import { getDashboardRoutes } from './routes/dashboardRoutes'
import { getGoalRoutes } from './routes/goalRoutes'
import { getMeasurementsRoutes } from './routes/measurementsRoutes'
import { getRecommendationsRoutes } from './routes/recommendationsServiceIA'

// ================= CONFIG =================
dotenv.config()

const app: Application = express()
const httpServer = createServer(app)

// Confiar en el proxy de Railway para que el rate-limit y CORS funcionen bien
app.set('trust proxy', 1)

// Orígenes permitidos (URLs de tu frontend en producción y desarrollo)
const allowedOrigins = [
  'https://forgy-mobile-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:8100',
  'http://localhost:3000',
  'http://localhost',       // Origen por defecto en Android (Capacitor)
  'https://localhost',      // Origen en Android/iOS con HTTPS
  'capacitor://localhost'   // Origen por defecto en iOS (Capacitor)
]

if (process.env.FRONTEND_URL) {
  let url = process.env.FRONTEND_URL.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  url = url.replace(/\/$/, '')
  if (!allowedOrigins.includes(url)) {
    allowedOrigins.push(url)
  }
}

// Función para validar orígenes dinámicos en desarrollo y Vercel
const corsOriginChecker = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
  // Permitir peticiones sin origen (ej. apps móviles híbridas nativas, curl, postman)
  if (!origin) {
    callback(null, true)
    return
  }

  // Comprobar si el origen está en el array permitido
  if (allowedOrigins.includes(origin)) {
    callback(null, true)
    return
  }

  // Permitir cualquier puerto local en desarrollo
  if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
    callback(null, true)
    return
  }

  // Permitir subdominios de Vercel (para URLs de preview en Vercel)
  if (origin.endsWith('.vercel.app')) {
    callback(null, true)
    return
  }

  callback(new Error('Not allowed by CORS'))
}

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginChecker,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  },
})

const PORT = process.env.PORT || 3000

// ================= MIDDLEWARES =================
// Limitar peticiones para evitar fuerza bruta y DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 2000, // Máximo 2000 peticiones por IP cada 15 minutos (aumentado)
  message: { success: false, message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.' },
})

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression())
app.use(cors({ origin: corsOriginChecker, credentials: true }))
app.use(limiter)
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

// ⚠️ IMPORTANTE: ejecutar las funciones
app.use('/exercises', getExercisesRoutes())
app.use('/routines', getRoutinesRoutes())
app.use('/workouts', getWorkoutsRoutes())
app.use('/progress', getProgressRoutes())
app.use('/auth', getAuthRoutes())
app.use('/user', getUserRoutes())
app.use('/dashboard', getDashboardRoutes())
app.use('/goals', getGoalRoutes())
app.use('/measurements', getMeasurementsRoutes())
app.use('/ai', getRecommendationsRoutes())

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
const startServer = async () => {
  try {
    await connectDB()

    // Sembrar ejercicios automáticamente si la base de datos está vacía
    const { seedExercisesIfNeeded, fixMuscleCategories } = require('./utils/seeder')
    seedExercisesIfNeeded()
      .then(() => {
        return fixMuscleCategories();
      })
      .catch((err: any) => {
        console.error('Error durante auto-seeding o corrección de ejercicios:', err)
      })

    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    })
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error)
    process.exit(1)
  }
}

startServer()
