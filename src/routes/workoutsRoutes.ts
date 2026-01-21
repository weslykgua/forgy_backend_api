import { Router } from 'express'
import {
  getWorkouts,
  getWorkoutById,
  getWorkoutHistory,
  getPersonalRecords,
  getWorkoutCalendar,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutsController'

export function getWorkoutsRoutes() {
  const router = Router()

  router.get('/', getWorkouts)
  router.get('/history', getWorkoutHistory)
  router.get('/prs', getPersonalRecords)
  router.get('/calendar', getWorkoutCalendar)
  router.get('/:id', getWorkoutById)
  router.post('/', createWorkout)
  router.put('/:id', updateWorkout)
  router.delete('/:id', deleteWorkout)

  return router
}
