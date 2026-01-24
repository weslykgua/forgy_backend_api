import { Router } from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/userController'
import { validateToken } from '../controllers/authenticationController'

const router = Router()

/**
 * POST /api/auth/register
 */
router.post('/register', register)

/**
 * POST /api/auth/login
 */
router.post('/login', login)

/**
 * GET /api/auth/profile
 * Headers: Authorization: {token} o Authorization: Bearer {token}
 */
router.get('/profile', validateToken, getProfile)

/**
 * PUT /api/auth/profile
 */
router.put('/profile', validateToken, updateProfile)

/**
 * PUT /api/auth/change-password
 */
router.put('/change-password', validateToken, changePassword)

/**
 * DELETE /api/auth/account
 */
router.delete('/account', validateToken, deleteAccount)

export default router