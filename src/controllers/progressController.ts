import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function upsertProgress(req: Request, res: Response) {
  try {
    const { date, userId, ...data } = req.body

    const progress = await prisma.dailyProgress.upsert({
      where: { date: new Date(date) },
      update: { ...data, userId },
      create: {
        date: new Date(date),
        userId,
        ...data
      }
    })

    res.json(progress)
  } catch {
    res.status(400).json({ error: 'Error al guardar progreso' })
  }
}

export async function getProgressHistory(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string | undefined
    const days = Number(req.query.days) || 30
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const progress = await prisma.dailyProgress.findMany({
      where: {
        userId: userId || undefined,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    })

    res.json(progress)
  } catch {
    res.status(500).json({ error: 'Error al obtener historial de progreso' })
  }
}