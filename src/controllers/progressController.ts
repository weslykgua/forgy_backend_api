import { Request, Response } from 'express'
import prisma from '../config/database'

function resolveUserId(req: Request) {
  return (req.body?.token?.userId ?? req.body?.userId ?? req.query.userId) as string | undefined
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export async function upsertProgress(req: Request, res: Response) {
  try {
    const { date, token, userId: bodyUserId, ...data } = req.body
    const userId = resolveUserId(req)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const progressDate = new Date(date)
    const startOfDay = new Date(progressDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(progressDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingProgress = await prisma.dailyProgress.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    const progress = existingProgress
      ? await prisma.dailyProgress.update({
        where: { id: existingProgress.id },
        data: { ...data }
      })
      : await prisma.dailyProgress.create({
        data: {
          date: progressDate,
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
    const userId = resolveUserId(req)
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

export async function getProgressStats(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const weightStartDate = new Date()
    weightStartDate.setDate(weightStartDate.getDate() - 7)

    const [sessionsCount, volumeAgg, waterAgg, weightEntries, latestProgress, streak, user] = await Promise.all([
      prisma.trainingSession.count({ where: { userId } }),
      prisma.trainingSession.aggregate({ where: { userId }, _sum: { totalVolume: true } }),
      prisma.dailyProgress.aggregate({ where: { userId, date: { gte: startDate } }, _avg: { waterIntake: true } }),
      prisma.dailyProgress.findMany({
        where: { userId, date: { gte: weightStartDate } },
        orderBy: { date: 'asc' },
        select: { date: true, weight: true }
      }),
      prisma.dailyProgress.findFirst({
        where: { userId, weight: { not: null } },
        orderBy: { date: 'desc' },
        select: { weight: true }
      }),
      prisma.workoutStreak.findUnique({ where: { userId }, select: { currentStreak: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { weight: true } })
    ])

    res.json({
      totalWorkouts: sessionsCount,
      totalVolume: volumeAgg._sum.totalVolume || 0,
      avgWater: Math.round(waterAgg._avg.waterIntake || 0),
      weightHistory: weightEntries
        .filter((entry) => entry.weight !== null)
        .map((entry) => ({
          date: getDateKey(entry.date),
          weight: Number(entry.weight)
        })),
      currentWeight: latestProgress?.weight ?? user?.weight ?? null,
      streakDays: streak?.currentStreak || 0
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener estadísticas de progreso' })
  }
}