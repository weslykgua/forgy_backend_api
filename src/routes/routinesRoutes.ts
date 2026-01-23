import { Router } from 'express'
import {
  getRoutines,
  createRoutine,
  deleteRoutine,
  addExerciseToRoutine,
  removeExerciseFromRoutine
} from '../controllers/routinesController'

export function getRoutinesRoutes() {
  const router = Router()

  router.get('/', getRoutines)
  //router.get('/:id', getRoutineById)
  router.post('/', createRoutine)
  //router.put('/:id', updateRoutine)
  router.delete('/:id', deleteRoutine)
  router.post('/:id/exercises', addExerciseToRoutine)
  router.delete('/:id/exercises/:exerciseId', removeExerciseFromRoutine)

  return router
}