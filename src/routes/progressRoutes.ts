import { Router } from 'express'
import { upsertProgress, getProgressHistory, getProgressStats } from '../controllers/progressController'
import { validateToken } from '../controllers/authenticationController'

export function getProgressRoutes() {
  const router = Router()

  router.use(validateToken)

  router.post('/', upsertProgress)
  router.get('/', getProgressHistory)
  router.get('/stats', getProgressStats)

  return router
}
