import { Router, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import crypto from 'crypto'
import prisma from '../config/database'

const router = Router()

const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, originalHash] = stored.split(':')
  if (!salt || !originalHash) return false
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
  } catch {
    return false
  }
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const name = req.body.name ? String(req.body.name).trim() : null

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'El password debe tener al menos 6 caracteres',
      })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'El email ya esta registrado',
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword(password),
      },
    })

    const { password: _, ...safeUser } = user

    return res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: safeUser,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'El email ya esta registrado',
      })
    }

    console.error('Error al registrar usuario:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios',
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    const { password: _, ...safeUser } = user

    return res.json({
      success: true,
      message: 'Login exitoso',
      data: safeUser,
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
