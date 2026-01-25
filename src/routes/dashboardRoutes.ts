import { Router } from 'express'
import { getDashboardMetrics } from '../controllers/dashboardController'
import { validateToken } from '../controllers/authenticationController'

export function getDashboardRoutes() {
  const router = Router()

  router.use(validateToken)

  router.get('/:userId', getDashboardMetrics)

  return router
}