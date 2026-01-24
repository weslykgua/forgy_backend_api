import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'forgy-secret-key-change-in-production'

interface JWTPayload {
  userId: string
  email: string
  from: string
  until: string
}

export async function register(req: Request, res: Response) {
  try {
    const email =
      typeof req.body.email === 'string' ? req.body.email.trim() : ''
    const password =
      typeof req.body.password === 'string' ? req.body.password : ''
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password y name son requeridos',
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'El email ya esta registrado' })
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
    const safeSaltRounds = Number.isFinite(saltRounds) && saltRounds > 0 ? saltRounds : 10
    const hashedPassword = await bcrypt.hash(password, safeSaltRounds)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      from: now.toISOString(),
      until: expiresAt.toISOString(),
    }
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      user,
      token,
      tokenData: {
        userId: user.id,
        from: now.toISOString(),
        until: expiresAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error en register:', error)
    return res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const email =
      typeof req.body.email === 'string' ? req.body.email.trim() : ''
    const password =
      typeof req.body.password === 'string' ? req.body.password : ''

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son requeridos',
      })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales invalidas' })
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      from: now.toISOString(),
      until: expiresAt.toISOString(),
    }
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })

    const { password: _password, ...safeUser } = user
    return res.json({
      user: safeUser,
      token,
      tokenData: {
        userId: user.id,
        from: now.toISOString(),
        until: expiresAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    return res.status(500).json({ error: 'Error al iniciar sesion' })
  }
}
