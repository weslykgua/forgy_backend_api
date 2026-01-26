import { Router } from 'express'
import {
  generateRecommendations,
  getRecommendations,
  updateRecommendationStatus
} from '../controllers/aiController'
import { validateToken } from '../controllers/authenticationController'

export function getAIRoutes() {
  const router = Router()

  router.use(validateToken)

  /**
   * POST /api/ai/recommendations
   * Headers: Authorization: {token}
   */
  router.post('/recommendations', generateRecommendations)

  /**
   * GET /api/ai/recommendations
   * Headers: Authorization: {token}
   * Query params: status? (pending, accepted, dismissed)
   */
  router.get('/recommendations', getRecommendations)

  /**
   * PATCH /api/ai/recommendations/:id
   * Headers: Authorization: {token}
   * Body: { status: 'accepted' | 'dismissed' }
   */
  router.patch('/recommendations/:id', updateRecommendationStatus)

  return router
}