import { RequestHandler, Router } from 'express'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController'
import { validateToken } from '../controllers/authenticationController'

export function getGoalRoutes() {
  const router = Router()

  router.use(validateToken)

  router.get('/', getGoals as any)
  router.post('/', createGoal as any)
  router.put('/:id', updateGoal as any)
  router.delete('/:id', deleteGoal as any)

  return router
}