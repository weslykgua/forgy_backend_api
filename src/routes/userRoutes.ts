import { Router, Request, Response } from 'express'
import { validateToken } from '../controllers/authenticationController'
import prisma from '../config/database'

export function getUserRoutes() {
  const router = Router()

  // Obtener datos del perfil
  router.get('/profile', validateToken, async (req: Request, res: Response) => {
    try {
      const userId = req.body.token.userId
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, height: true, weight: true }
      })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el perfil' })
    }
  })

  // Actualizar datos del perfil (Peso, Altura)
  router.put('/profile', validateToken, async (req: Request, res: Response) => {
    try {
      const userId = req.body.token.userId
      const { height, weight } = req.body
      const user = await prisma.user.update({
        where: { id: userId },
        data: { height, weight }
      })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el perfil' })
    }
  })

  // Obtener racha de entrenamientos
  router.get('/streak', validateToken, async (req: Request, res: Response) => {
    try {
      const userId = req.body.token.userId
      const streak = await prisma.workoutStreak.findUnique({ where: { userId } })
      res.json({ currentStreak: streak?.currentStreak || 0 })
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la racha' })
    }
  })

  return router
}