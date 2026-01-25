import { Router } from 'express'
import {
  generateRecommendations,
  getRecommendations,
  updateRecommendationStatus
} from '../controllers/aiController'
import { optionalToken, validateToken } from '../controllers/authenticationController'

export function getAIRoutes() {
  const router = Router()

  router.use(optionalToken)

  /**
   * POST /api/ai/recommendations/:userId
   * Headers: Authorization: {token}
   */
  router.post('/recommendations/:userId', generateRecommendations)

  /**
   * GET /api/ai/recommendations/:userId
   * Headers: Authorization: {token}
   * Query params: status? (pending, accepted, dismissed)
   */
  router.get('/recommendations/:userId', getRecommendations)

  /**
   * PATCH /api/ai/recommendations/:id
   * Headers: Authorization: {token}
   * Body: { status: 'accepted' | 'dismissed' }
   */
  router.patch('/recommendations/:id', updateRecommendationStatus)

  return router
}