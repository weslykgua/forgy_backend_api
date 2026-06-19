import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'forgy-secret-key-change-in-production'

interface TokenData {
  userId: string
  email: string
  from: string
  until: string
}

function attachToken(req: Request, tokenData: TokenData) {
  req.body = req.body ?? {}
  req.body.token = {
    userId: tokenData.userId,
    email: tokenData.email,
    from: tokenData.from,
    until: tokenData.until,
  }
}

/**
 * Middleware para validar token JWT
 * Compatible con tu estructura existente
 */
export function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization as string | undefined

    if (!authHeader) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader

    const decoded = jwt.verify(token, JWT_SECRET) as TokenData

    const now = new Date()
    const until = new Date(decoded.until)

    if (now > until) {
      return res.status(401).json({ error: 'Token expirado' })
    }

    attachToken(req, decoded)

    next()
  } catch (error: any) {
    console.error('Error validando token:', error)
    return res.status(401).json({
      error: error.message || 'Token inválido'
    })
  }
}

/**
 * Middleware opcional - no falla si no hay token
 */
export function optionalToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization as string | undefined

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenData
        attachToken(req, decoded)
      } catch {
        console.log('Token opcional inválido, continuando sin auth')
      }
    }

    next()
  } catch {
    next()
  }
}