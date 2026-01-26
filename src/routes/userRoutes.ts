import { Router } from 'express'
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
} from '../controllers/userController'
import { validateToken } from '../controllers/authenticationController'

export function getUserRoutes() {
  const router = Router()

  // Todas las rutas requieren autenticación
  router.use(validateToken)

  /**
   * GET /api/user/profile
   * Headers: Authorization: {token}
   */
  router.get('/profile', getProfile)

  /**
   * PUT /api/user/profile
   * Headers: Authorization: {token}
   * Body: { name?, age?, weight?, height?, gender?, activityLevel?, fitnessGoal? }
   */
  router.put('/profile', updateProfile)

  /**
   * PUT /api/user/change-password
   * Headers: Authorization: {token}
   * Body: { currentPassword, newPassword }
   */
  router.put('/change-password', changePassword)

  /**
   * DELETE /api/user/account
   * Headers: Authorization: {token}
   * Body: { password }
   */
  router.delete('/account', deleteAccount)

  /**
   * GET /api/user/stats
   * Headers: Authorization: {token}
   */
  return router
}