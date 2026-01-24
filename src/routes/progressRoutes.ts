import { Router } from 'express'
import {
  upsertProgress,
  getProgressHistory
} from '../controllers/progressController'

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
  router.post('/', upsertProgress)

  /**
   * GET /api/progress
   * Query params: userId, days? (default: 30)
   * Obtiene el historial de progreso diario
   */
  router.get('/', getProgressHistory)

  return router
}
