import { Router } from 'express'
import {
    generateRecommendations,
    getRecommendations,
    updateRecommendationStatus
} from '../controllers/recommendationsServiceIA'

export function getDashboardRoutes(): Router {
    const router = Router()
    /**
     * POST /api/ai/recommendations/:userId
     * Genera nuevas recomendaciones personalizadas basadas en:
     * - Frecuencia de entrenamiento
     * - Equilibrio muscular
     * - Progresión
     * - Recuperación (sueño, hidratación)
     * - Metas
     * - Cambios en peso corporal
     */
    router.post('/recommendations/:userId', generateRecommendations)

    /**
     * GET /api/ai/recommendations/:userId
     * Query params: status? (pending, accepted, dismissed)
     * Obtiene las recomendaciones del usuario
     */
    router.get('/recommendations/:userId', getRecommendations)

    /**
     * PATCH /api/ai/recommendations/:id
     * Body: { status: 'accepted' | 'dismissed' }
     * Actualiza el estado de una recomendación
     */
    router.patch('/recommendations/:id', updateRecommendationStatus)

    return router
}