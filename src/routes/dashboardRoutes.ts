import { Router } from 'express'
import { getDashboardMetrics } from '../controllers/dashboardController'
import { optionalToken, validateToken } from '../controllers/authenticationController'

export function getDashboardRoutes() {
  const router = Router()

  router.use(optionalToken)

  router.get('/:userId', getDashboardMetrics)

  return router
}