import { Router } from 'express'
import {
  getExercises,
  getExerciseStats,
  seedExercises
} from '../controllers/exercisesController'

export function getExercisesRoutes(): Router {
  const router = Router()

  router.get('/', getExercises)
  router.get('/stats', getExerciseStats)
  router.post('/seed', seedExercises)

  return router
}
