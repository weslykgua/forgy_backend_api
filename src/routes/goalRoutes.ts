import { RequestHandler, Router } from 'express'
import { getGoals, createGoal, updateGoal, deleteGoal, getPlan, upsertPlan, deletePlan } from '../controllers/goalController'
import { validateToken } from '../controllers/authenticationController'

export function getGoalRoutes() {
  const router = Router()

  router.use(validateToken)

  router.get('/', getGoals as any)
  router.get('/plan', getPlan as any)
  router.post('/plan', upsertPlan as any)
  router.put('/plan', upsertPlan as any)
  router.delete('/plan', deletePlan as any)
  router.post('/', createGoal as any)
  router.put('/:id', updateGoal as any)
  router.delete('/:id', deleteGoal as any)

  return router
}
