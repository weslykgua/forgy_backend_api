import { Router } from 'express'
import { getMeasurements, createMeasurement } from '../controllers/measurementsController'
import { validateToken } from '../controllers/authenticationController'

export function getMeasurementRoutes() {
  const router = Router()

  router.use(validateToken)

  /**
   * GET /api/measurements
   * Headers: Authorization: {token}
   * Query params: userId
   */
  router.get('/', getMeasurements)

  /**
   * POST /api/measurements
   * Headers: Authorization: {token}
   */
  router.post('/', createMeasurement)

  return router
}