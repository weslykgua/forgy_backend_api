import { Router } from 'express'
import { upsertProgress, getProgressHistory } from '../controllers/progressController'
import { optionalToken, validateToken } from '../controllers/authenticationController'

export function getProgressRoutes() {
  const router = Router()

  router.use(optionalToken)

  router.post('/', upsertProgress)
  router.get('/', getProgressHistory)

  return router
}