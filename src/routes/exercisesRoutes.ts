import { Router } from 'express'
import {
  getExercises,
  getExerciseStats
} from '../controllers/exercisesController'
import { validateAdminToken } from '../controllers/authenticationController'

export function getExercisesRoutes(): Router {
  const router = Router()

  router.get('/', getExercises)
  router.get('/stats', getExerciseStats)
  router.post('/', validateAdminToken, setExercise)

  return router
}
