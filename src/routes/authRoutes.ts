import { Router } from 'express'
import { register } from '../controllers/authController'

export function getAuthRoutes(): Router {
  const router = Router()

  /**
   * POST /auth/register
   * Body: { email, password, name }
   */
  router.post('/register', register)

  return router
}
