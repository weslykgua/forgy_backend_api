import { Router } from 'express'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController'
import { validateToken } from '../controllers/authenticationController'

export function getGoalRoutes() {
  const router = Router()

  router.use(validateToken)

  router.get('/', getGoals)
  router.post('/', createGoal)
  router.put('/:id', updateGoal)
  router.delete('/:id', deleteGoal)

  return router
}