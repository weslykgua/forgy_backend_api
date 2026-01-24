import { Router } from 'express'
import {
    getDashboardMetrics
} from '../controllers/dashboardController'

export function getDashboardRoutes(): Router {
    const router = Router()
    /**
     * GET /api/dashboard/:userId
     * Retorna todas las métricas para el dashboard:
     * - Total de entrenamientos
     * - Entrenamientos últimos 30 días
     * - Duración promedio
     * - Racha actual y mejor racha
     * - Volumen total
     * - Récords recientes
     * - Calendario de actividad
     */
    router.get('/:userId', getDashboardMetrics)

    return router
}