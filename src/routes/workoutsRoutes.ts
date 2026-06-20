import { Router } from 'express'
import {
  createWorkout,
  getWorkoutHistory,
  getWorkoutsByDate,
  getWorkoutCalendar,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutsController'
import { getWorkoutStreak } from '../controllers/streakController'
import { getPersonalRecords } from '../controllers/recordsController'
import { validateToken } from '../controllers/authenticationController'

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
  router.post('/', validateToken, createWorkout)

  /**
   * GET /api/workouts?date=YYYY-MM-DD
   * Obtiene los ejercicios registrados para un día específico
   */
  router.get('/', validateToken, getWorkoutsByDate)

  /**
   * GET /api/workouts/calendar
   * Devuelve un mapa de días con entrenamientos
   */
  router.get('/calendar', validateToken, getWorkoutCalendar)

  /**
   * PUT /api/workouts/:id
   * Actualiza un entrenamiento puntual
   */
  router.put('/:id', validateToken, updateWorkout)

  /**
   * DELETE /api/workouts/:id
   * Elimina un entrenamiento puntual
   */
  router.delete('/:id', validateToken, deleteWorkout)

  /**
   * GET /api/workouts/history
   * Query params: userId, limit (default: 10)
   * Obtiene el historial de entrenamientos
   */
  router.get('/history', validateToken, getWorkoutHistory)

  /**
   * GET /api/workouts/streak
   * Obtiene la racha actual y mejor racha del usuario
   */
  router.get('/streak', validateToken, getWorkoutStreak)

  /**
   * GET /api/workouts/records
   * Query params: exerciseId? (opcional para filtrar por ejercicio)
   * Obtiene los récords personales del usuario
   */
  router.get('/records', validateToken, getPersonalRecords)

  return router
}
