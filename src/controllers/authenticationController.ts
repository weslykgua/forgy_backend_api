import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'forgy-super-secret-key-for-dev'

interface TokenData {
  userId: string
  email: string
  from: string
  until: string
}

/**
 * Middleware para validar token JWT
 * Agrega los datos del token a req.body.token
 */
export function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization as string | undefined

    if (!authHeader) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    // Extraer el token (Bearer TOKEN o solo TOKEN)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader

    // Verificar y decodificar token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenData

    // Verificar si el token ha expirado
    const now = new Date()
    const until = new Date(decoded.until)

    if (now > until) {
      return res.status(401).json({ error: 'Token expirado' })
    }

    // Agregar token decodificado al body
    req.body.token = {
      userId: decoded.userId,
      email: decoded.email,
      from: decoded.from,
      until: decoded.until
    }

    next()
  } catch (error) {
    console.error('Error validando token:', error)
    return res.status(401).json({ error: 'Token inválido' })
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
        
        req.body.token = {
          userId: decoded.userId,
          email: decoded.email,
          from: decoded.from,
          until: decoded.until
        }
      } catch (error) {
        // Token inválido, pero continuamos sin autenticación
        console.log('Token opcional inválido, continuando sin auth')
      }
    }

    next()
  } catch (error) {
    next()
  }
}