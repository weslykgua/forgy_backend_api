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

/**
 * Registra un nuevo usuario
 */
export async function register(req: Request, res: Response) {
  try {
    const { 
      email, 
      password, 
      name, 
      age, 
      weight, 
      height, 
      gender, 
      activityLevel, 
      fitnessGoal 
    } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(409).json({ 
        error: 'El email ya está registrado' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        age,
        weight,
        height,
        gender,
        activityLevel,
        fitnessGoal
      }
    })

    await prisma.workoutStreak.create({
      data: {
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0
      }
    })

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 días

    const tokenPayload: JWTPayload = { 
      userId: user.id, 
      email: user.email,
      from: now.toISOString(),
      until: expiresAt.toISOString()
    }

    // ✅ Solución: usar '7d' directamente como literal o quitar las options
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })

    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token,
      tokenData: {
        userId: user.id,
        from: now.toISOString(),
        until: expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

/**
 * Inicia sesión
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      })
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const tokenPayload: JWTPayload = { 
      userId: user.id, 
      email: user.email,
      from: now.toISOString(),
      until: expiresAt.toISOString()
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' })

    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token,
      tokenData: {
        userId: user.id,
        from: now.toISOString(),
        until: expiresAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            routines: true,
            sessions: true,
            goals: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const { password: _, ...userWithoutPassword } = user

    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string
    const { name, age, weight, height, gender, activityLevel, fitnessGoal } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, age, weight, height, gender, activityLevel, fitnessGoal }
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    res.status(500).json({ error: 'Error al actualizar perfil' })
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva son obligatorias' 
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'La contraseña actual es incorrecta' 
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Contraseña cambiada exitosamente' })
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ 
        error: 'Se requiere la contraseña para eliminar la cuenta' 
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Contraseña incorrecta' 
      })
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ message: 'Cuenta eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar cuenta:', error)
    res.status(500).json({ error: 'Error al eliminar cuenta' })
  }
}