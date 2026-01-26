import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getWeekRange(baseDate = new Date()) {
  const start = new Date(baseDate)
  const day = start.getDay() // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

async function pruneOldWeekProgress(userId: string) {
  const { start } = getWeekRange()
  await prisma.dailyProgress.deleteMany({
    where: {
      userId,
      date: { lt: start }
    }
  })
}

export async function upsertProgress(req: Request, res: Response) {
  try {
    const token = req.body.token as { userId?: string } | undefined
    const userId = token?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autorizado' })
    }

    const { date, token: _token, ...data } = req.body
    const progressDate = new Date(date)

    await pruneOldWeekProgress(userId)

    const progress = await prisma.dailyProgress.upsert({
      where: { userId_date: { userId, date: progressDate } },
      update: { ...data, userId },
      create: {
        date: progressDate,
        userId,
        ...data
      }
    })

    res.json(progress)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al guardar progreso' })
  }
}

export async function getProgressHistory(req: Request, res: Response) {
  try {
    const token = req.body.token as { userId?: string } | undefined
    const userId = token?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autorizado' })
    }

    await pruneOldWeekProgress(userId)
    const { start, end } = getWeekRange()

    const progress = await prisma.dailyProgress.findMany({
      where: {
        userId,
        date: { gte: start, lte: end }
      },
      orderBy: { date: 'asc' }
    })

    res.json(progress)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener historial de progreso' })
  }
}

export async function getProgressStats(req: Request, res: Response) {
  try {
    const token = req.body.token as { userId?: string } | undefined
    const userId = token?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autorizado' })
    }

    await pruneOldWeekProgress(userId)
    const { start, end } = getWeekRange()

    const [
      totalWorkouts,
      totalVolume,
      streak,
      weekProgress,
      latestWeight
    ] = await Promise.all([
      prisma.trainingSession.count({ where: { userId } }),
      prisma.trainingSession.aggregate({
        where: { userId },
        _sum: { totalVolume: true }
      }),
      prisma.workoutStreak.findUnique({ where: { userId } }),
      prisma.dailyProgress.findMany({
        where: { userId, date: { gte: start, lte: end } },
        orderBy: { date: 'asc' }
      }),
      prisma.dailyProgress.findFirst({
        where: { userId, weight: { not: null } },
        orderBy: { date: 'desc' }
      })
    ])

    const weightHistory = weekProgress
      .filter((item) => item.weight !== null && item.weight !== undefined)
      .map((item) => ({
        date: item.date.toISOString().split('T')[0],
        weight: item.weight as number
      }))

    const avgWater = weekProgress.length
      ? Math.round(
          weekProgress.reduce((sum, item) => sum + (item.waterIntake || 0), 0) /
            weekProgress.length
        )
      : 0

    res.json({
      totalWorkouts,
      totalVolume: totalVolume._sum.totalVolume || 0,
      avgWater,
      weightHistory,
      currentWeight: latestWeight?.weight || 0,
      streakDays: streak?.currentStreak || 0
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener estadÃ­sticas de progreso' })
  }
}
