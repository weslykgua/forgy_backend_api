import { Router } from 'express'
import {
  upsertProgress,
  getProgressHistory,
  getProgressStats
} from '../controllers/progressController'
import { validateToken } from '../controllers/authenticationController'

export function getProgressRoutes(): Router {
  const router = Router()
  /**
   * POST /api/progress
   * Body: {
   *   date,
   *   userId,
   *   weight?, 
   *   waterIntake?, 
   *   caloriesConsumed?, 
   *   caloriesBurned?,
   *   sleepHours?, 
   *   mood?, 
   *   energy?, 
   *   stress?, 
   *   notes?
   * }
   * Crea o actualiza el progreso diario
   */
  router.use(validateToken)
  router.post('/', upsertProgress)

  /**
   * GET /api/progress
   * Query params: userId, days? (default: 30)
   * Obtiene el historial de progreso diario
   */
  router.get('/', getProgressHistory)

  /**
   * GET /api/progress/stats
   * Obtiene estadísticas resumidas del progreso del usuario
   */
  router.get('/stats', getProgressStats)

  return router
}
