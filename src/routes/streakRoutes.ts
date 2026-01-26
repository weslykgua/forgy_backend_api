import { Router } from 'express'
import { validateToken } from '../controllers/authenticationController'
import { getWorkoutStreak, updateWorkoutStreak } from '../controllers/streakController'

export function getStreakRoutes() {
  const router = Router()

  // Todas las rutas requieren autenticación
  router.use(validateToken)

  /**
   * GET /api/user/streak
   * Devuelve la racha actual del usuario
   */
  router.get('/', async (req, res) => {
    try {
      const userId = (req as any).token.userId
      const streak = await getWorkoutStreak(userId)
      res.json(streak)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al obtener la racha' })
    }
  })

  /**
   * POST /api/user/streak
   * Actualiza la racha con un entrenamiento nuevo
   */
  router.post('/', async (req, res) => {
    try {
      const userId = (req as any).token.userId
      const streak = await updateWorkoutStreak(userId)
      res.json(streak)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al actualizar la racha' })
    }
  })

  return router
}
