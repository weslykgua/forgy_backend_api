import { Router } from 'express'
import { register, login } from '../controllers/authController'

export function getAuthRoutes() {
  const router = Router()

  /**
   * POST /api/auth/register
   * Body: { email, password, name }
   */
  router.post('/register', register)

  /**
   * POST /api/auth/login
   * Body: { email, password }
   */
  router.post('/login', login)

  return router
}