import { Router } from 'express'
import {
  getExercises,
  getExerciseStats
} from '../controllers/exercisesController'

export function getExercisesRoutes(): Router {
  const router = Router()

  router.get('/', getExercises)
  router.get('/stats', getExerciseStats)

  return router
}
