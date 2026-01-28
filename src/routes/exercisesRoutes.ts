import { Router } from 'express'
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getStats
} from '../controllers/exercisesController'

export function getExercisesRoutes() {
  const router = Router()

  router.get('/stats', getStats) // Importante: definir antes de /:id
  router.get('/', getExercises)
  router.post('/', createExercise)
  router.put('/:id', updateExercise)
  router.delete('/:id', deleteExercise)

  return router
}