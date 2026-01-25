import { Router } from 'express'
import {
  createWorkout,
  getWorkoutHistory,
  getWorkoutStreak,
  getPersonalRecords
} from '../controllers/workoutsController'
import { validateToken } from '../controllers/authenticationController'

export function getWorkoutsRoutes() {
  const router = Router()

  router.use(validateToken)

  router.post('/', createWorkout)
  router.get('/history', getWorkoutHistory)
  router.get('/streak/:userId', getWorkoutStreak)
  router.get('/records/:userId', getPersonalRecords)

  return router
}