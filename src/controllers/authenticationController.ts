import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TokenData } from '../interfaces/TokenData'
import { JWTPayload } from '../interfaces/JwtPayloadInterface'
import { RequestWithTokenInterface } from '../interfaces/RequestWithTokenInterface'

const JWT_SECRET = process.env.JWT_SECRET || 'forgy-super-secret-key-for-dev'


const admins = [
  "weslykgu@ghdwsfvchjdwgvc"
]

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

    // Verificar y decodificar token - USA JWTPayload en lugar de TokenData
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

    // Verificar si el token ha expirado
    const now = new Date()
    const until = new Date(decoded.until)

    if (now > until) {
      return res.status(401).json({ error: 'Token expirado' })
    }

    // Adjuntar datos del token a la petición para uso en los controladores.
    // Usamos `(req as any)` para extender el objeto Request sin modificar los tipos globales.
    (req as RequestWithTokenInterface).token = {
      userId: decoded.userId,
      email: decoded.email,
      from: decoded.from,
      until: decoded.until
    } as JWTPayload
    next()
  } catch (error) {
    console.error('Error validando token:', error)
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export function validateAdminToken(req: Request, res: Response, next: NextFunction) {
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

  if (!isAdminEmail(decoded.email)) {
    return res.status(401).json({ error: 'No tiene permiso' })
  }
  next()
}

function isAdminEmail(email: string): boolean {
  return admins.includes(email)
}