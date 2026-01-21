import {
  getExercises,
  getIdRequest,
  getStatsRequest,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../controllers/exercisesController'
import { Router } from 'express'

export function getExercisesRoutes() {
  const router = Router()

  router.get('/', getExercises)
  router.get('/stats', getStatsRequest)
  router.get('/:id', getIdRequest)
  router.post('/', createExercise)
  router.put('/:id', updateExercise)
  router.delete('/:id', deleteExercise)

  return router
}
