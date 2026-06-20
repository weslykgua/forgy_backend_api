import { Router, Request, Response } from 'express'
import { validateToken } from '../controllers/authenticationController'
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/userController'
import prisma from '../config/database'

export function getUserRoutes() {
  const router = Router()

  // Obtener datos del perfil completo
  router.get('/profile', validateToken, getProfile)

  // Actualizar datos del perfil completo (nombre, peso, altura, metas, etc)
  router.put('/profile', validateToken, updateProfile)

  // Cambiar contraseña de forma segura
  router.post('/change-password', validateToken, changePassword)

  // Eliminar la cuenta de usuario
  router.delete('/', validateToken, deleteAccount)

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