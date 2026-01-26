import { Router } from 'express'
import { getDashboardMetrics } from '../controllers/metricsController'
import { optionalToken, validateToken } from '../controllers/authenticationController'

export function getDashboardRoutes() {
  const router = Router()

  router.use(validateToken)

  router.get('/', validateToken, getDashboardMetrics)

  return router
}