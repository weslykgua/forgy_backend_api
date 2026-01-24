import { Router } from 'express'
import {
  createWorkout,
  getWorkoutHistory,
} from '../controllers/workoutsController'
import { getWorkoutStreak } from '../controllers/streakController'
import { getPersonalRecords } from '../controllers/recordsController'

export function getWorkoutsRoutes(): Router {
  const router = Router()
  /**
   * POST /api/workouts
   * Body: {
   *   userId,
   *   routineId?,
   *   duration?,
   *   rating?,
   *   notes?,
   *   workouts: [{ 
   *     exerciseId, 
   *     sets: [{ reps, weight, completed, rpe? }], 
   *     notes?, 
   *     duration? 
   *   }]
   * }
   * Registra una sesión de entrenamiento completa
   */
  router.post('/', createWorkout)

  /**
   * GET /api/workouts/history
   * Query params: userId, limit (default: 10)
   * Obtiene el historial de entrenamientos
   */
  router.get('/history', getWorkoutHistory)

  /**
   * GET /api/workouts/streak/:userId
   * Obtiene la racha actual y mejor racha del usuario
   */
  router.get('/streak/:userId', getWorkoutStreak)

  /**
   * GET /api/workouts/records/:userId
   * Query params: exerciseId? (opcional para filtrar por ejercicio)
   * Obtiene los récords personales del usuario
   */
  router.get('/records/:userId', getPersonalRecords)

  return router
}
