import { Router } from 'express'
import { login, register } from '../controllers/authController'

export function getAuthRoutes(): Router {
  const router = Router()

  /**
   * POST /auth/register
   * Body: { email, password, name }
   */
  router.post('/register', register)

  /**
   * POST /auth/login
   * Body: { email, password }
   */
  router.post('/login', login)

  return router
}
