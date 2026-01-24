import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    const user = await prisma.user.create({
      data: { email, password, name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return res.status(201).json({ user })
  } catch (error) {
    console.error('Error en register:', error)
    return res.status(500).json({ error: 'Error al registrar usuario' })
  }
}
