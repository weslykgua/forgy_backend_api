import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../interfaces/JwtPayload'

const prisma = new PrismaClient()
// DIAGNÓSTICO: Asegúrate de que esta clave sea la misma en `authenticationController.ts`
const JWT_SECRET = process.env.JWT_SECRET || 'forgy-super-secret-key-for-dev'

/**
 * Registra un nuevo usuario
 */
export async function register(req: Request, res: Response) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password y name son requeridos',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres',
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' })
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

    // Crear racha inicial
    await prisma.workoutStreak.create({
      data: {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
      }
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
      message: 'Usuario registrado exitosamente',
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

/**
 * Inicia sesión
 */
export async function login(req: Request, res: Response) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''

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
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        fitnessGoal: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
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
      message: 'Inicio de sesión exitoso',
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
    return res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}