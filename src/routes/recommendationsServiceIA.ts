import { Router } from 'express'
import {
    generateRecommendations,
    getRecommendations,
    updateRecommendationStatus
} from '../controllers/recommendationsServiceIA'
import { validateToken } from '../controllers/authenticationController'

export function getRecommendationsRoutes(): Router {
    const router = Router()
    /**
     * POST /api/ai/recommendations
     * Genera nuevas recomendaciones personalizadas basadas en el historial del usuario autenticado.
     */
    router.post('/recommendations', validateToken, generateRecommendations)

    /**
     * GET /api/ai/recommendations
     * Query params: status? (pending, accepted, dismissed)
     * Obtiene las recomendaciones del usuario autenticado
     */
    router.get('/recommendations', validateToken, getRecommendations)

    /**
     * PATCH /api/ai/recommendations/:id
     * Body: { status: 'accepted' | 'dismissed' }
     * Actualiza el estado de una recomendación
     */
    router.patch('/recommendations/:id', validateToken, updateRecommendationStatus)

    return router
}