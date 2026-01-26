import { Router } from 'express'
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addExerciseToRoutine,
  removeExerciseFromRoutine
} from '../controllers/routinesController'
import { optionalToken, validateToken } from '../controllers/authenticationController'
export function getRoutinesRoutes() {
  const router = Router()

  // Proteger todas las rutas
  router.use(validateToken)

  router.get('/', getRoutines)
  router.post('/', createRoutine)
  router.put('/:id', updateRoutine)
  router.delete('/:id', deleteRoutine)
  router.post('/:id/exercises', addExerciseToRoutine)
  router.delete('/:id/exercises/:exerciseId', removeExerciseFromRoutine)

  return router
}