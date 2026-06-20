import { Router } from 'express'
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addExerciseToRoutine,
  removeExerciseFromRoutine
} from '../controllers/routinesController'
import { validateToken } from '../controllers/authenticationController'
//import { validateToken } from '../controllers/authenticationController'

export function getRoutinesRoutes(): Router {
  const router = Router()

  /**
   * GET /api/routines
   * Query params: userId
   * Obtiene todas las rutinas del usuario
   */
  router.get('/', validateToken, getRoutines)

  /**
   * POST /api/routines
   * Body: { name, userId, type?, description?, difficulty? }
   * Crea una nueva rutina/playlist
   */
  router.post('/', validateToken, createRoutine)

  /**
   * PUT /api/routines/:id
   * Body: { name?, description?, isFavorite?, difficulty? }
   * Actualiza una rutina existente
   */
  router.put('/:id', validateToken, updateRoutine)

  /**
   * DELETE /api/routines/:id
   * Elimina una rutina
   */
  router.delete('/:id', validateToken, deleteRoutine)

  /**
   * POST /api/routines/:id/exercises
   * Body: { 
   *   exerciseId, 
   *   order, 
   *   targetSets?, 
   *   targetReps?, 
   *   targetWeight?, 
   *   restTime?, 
   *   notes? 
   * }
   * Agrega un ejercicio a la rutina con parámetros
   */
  router.post('/:id/exercises', validateToken, addExerciseToRoutine)

  /**
   * DELETE /api/routines/:id/exercises/:exerciseId
   * Elimina un ejercicio de la rutina
   */
  router.delete('/:id/exercises/:exerciseId', validateToken, removeExerciseFromRoutine)

  return router
}
