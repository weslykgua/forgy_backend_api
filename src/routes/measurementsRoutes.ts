import { Router } from 'express'
import {
  getMeasurements,
  createMeasurement
} from '../controllers/measurementsController'
import { validateToken } from '../controllers/authenticationController'

export function getMeasurementsRoutes(): Router {
  const router = Router()

  /**
   * GET /api/measurements
   * Obtiene todas las mediciones corporales del usuario autenticado
   */
  router.get('/', validateToken, getMeasurements)

  /**
   * POST /api/measurements
   * Body: {
   *   date, 
   *   weight?, 
   *   bodyFat?, 
   *   chest?, 
   *   waist?, 
   *   hips?,
   *   bicepLeft?, 
   *   bicepRight?, 
   *   thighLeft?, 
   *   thighRight?,
   *   calves?, 
   *   neck?, 
   *   shoulders?
   * }
   * Registra una nueva medición corporal para el usuario autenticado
   */
  router.post('/', validateToken, createMeasurement)
  return router
}
