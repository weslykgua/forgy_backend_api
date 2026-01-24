import { Router } from 'express'
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} from '../controllers/goalController'

export function getExercisesRoutes(): Router {
    const router = Router()

    /**
     * GET /api/goals
     * Query params: userId, achieved? (true/false)
     * Obtiene las metas del usuario
     */
    router.get('/', getGoals)

    /**
     * POST /api/goals
     * Body: {
     *   userId,
     *   type, (weight_loss, muscle_gain, strength, endurance, flexibility)
     *   target,
     *   current,
     *   unit?,
     *   deadline?,
     *   priority?
     * }
     * Crea una nueva meta
     */
    router.post('/', createGoal)

    /**
     * PUT /api/goals/:id
     * Body: { current?, target?, deadline?, achieved?, priority? }
     * Actualiza una meta existente
     */
    router.put('/:id', updateGoal)

    /**
     * DELETE /api/goals/:id
     * Elimina una meta
     */
    router.delete('/:id', deleteGoal)

    return router
}