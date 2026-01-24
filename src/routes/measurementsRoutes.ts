import { Router } from 'express'
import {
  getMeasurements,
  createMeasurement
} from '../controllers/measurementsController'

export function getMeasurementsRoutes(): Router {
  const router = Router()

  /**
   * GET /api/measurements
   * Query params: userId
   * Obtiene todas las mediciones corporales
   */
  router.get('/', getMeasurements)

  /**
   * POST /api/measurements
   * Body: {
   *   date, 
   *   userId,
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
   * Registra una nueva medición corporal
   */
  router.post('/', createMeasurement)
  return router
}
