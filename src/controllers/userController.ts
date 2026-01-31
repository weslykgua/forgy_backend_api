import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        fitnessGoal: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            routines: true,
            sessions: true,
            goals: true,
            records: true,
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    return res.json(user)
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

/**
 * Actualiza el perfil del usuario autenticado
 */
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string
    const {
      name,
      age,
      weight,
      height,
      gender,
      activityLevel,
      fitnessGoal
    } = req.body

    const data: any = {}
    if (name !== undefined) data.name = name
    if (age !== undefined) data.age = age
    if (weight !== undefined) data.weight = weight
    if (height !== undefined) data.height = height
    if (gender !== undefined) data.gender = gender
    if (activityLevel !== undefined) data.activityLevel = activityLevel
    if (fitnessGoal !== undefined) data.fitnessGoal = fitnessGoal

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        fitnessGoal: true,
        updatedAt: true,
      }
    })

    return res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return res.status(500).json({ error: 'Error al actualizar perfil' })
  }
}

/**
 * Cambia la contraseña del usuario
 */
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string
    const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : ''
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : ''

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
      where: { id: userId },
      select: { id: true, password: true }
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

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10)
    const safeSaltRounds = Number.isFinite(saltRounds) && saltRounds > 0 ? saltRounds : 10
    const hashedPassword = await bcrypt.hash(newPassword, safeSaltRounds)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return res.json({ message: 'Contraseña cambiada exitosamente' })
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}

/**
 * Elimina la cuenta del usuario
 */
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string
    const password = typeof req.body.password === 'string' ? req.body.password : ''

    if (!password) {
      return res.status(400).json({
        error: 'Se requiere la contraseña para eliminar la cuenta'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
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

    // Eliminar usuario (cascade elimina todos sus datos)
    await prisma.user.delete({
      where: { id: userId }
    })

    return res.json({ message: 'Cuenta eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar cuenta:', error)
    return res.status(500).json({ error: 'Error al eliminar cuenta' })
  }
}