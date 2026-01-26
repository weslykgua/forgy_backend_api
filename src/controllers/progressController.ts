import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SHOULD_PRUNE_OLD_PROGRESS = process.env.PRUNE_OLD_PROGRESS === 'true'

function coerceNumber(value: unknown, { asInt = false } = {}) {
  if (value === null || value === undefined || value === '') return undefined
  let raw = value
  if (typeof raw === 'string') {
    raw = raw.trim().replace(/\s+/g, '')
    if (raw.includes(',') && raw.includes('.')) {
      raw = raw.replace(/\./g, '').replace(',', '.')
    } else if (raw.includes(',')) {
      raw = raw.replace(',', '.')
    } else if (/^\d{1,3}(\.\d{3})+$/.test(raw)) {
      raw = raw.replace(/\./g, '')
    }
  }
  const num = Number(raw)
  if (!Number.isFinite(num)) return undefined
  return asInt ? Math.round(num) : num
}

function buildProgressData(payload: any) {
  return {
    weight: coerceNumber(payload.weight),
    waterIntake: coerceNumber(payload.waterIntake, { asInt: true }),
    caloriesConsumed: coerceNumber(payload.caloriesConsumed, { asInt: true }),
    caloriesBurned: coerceNumber(payload.caloriesBurned, { asInt: true }),
    sleepHours: coerceNumber(payload.sleepHours),
    mood: typeof payload.mood === 'string' ? payload.mood : undefined,
    energy: coerceNumber(payload.energy, { asInt: true }),
    stress: coerceNumber(payload.stress, { asInt: true }),
    notes: typeof payload.notes === 'string' ? payload.notes : undefined,
    workoutsCompleted: coerceNumber(payload.workoutsCompleted, { asInt: true })
  }
}

function buildProfileData(payload: any) {
  const data: any = {}
  const weight = coerceNumber(payload.weight)
  const height = coerceNumber(payload.height)
  if (weight !== undefined) data.weight = weight
  if (height !== undefined) data.height = height
  return data
}

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
  if (!SHOULD_PRUNE_OLD_PROGRESS) {
    return
  }
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
    const userId = (req as any).token?.userId as string | undefined
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autorizado' })
    }

    const { date } = req.body ?? {}
    let progressDate =
      typeof date === 'string' && date.length >= 10
        ? new Date(`${date}T12:00:00`)
        : new Date(date ?? Date.now())

    if (isNaN(progressDate.getTime())) {
      progressDate = new Date()
    }
    progressDate.setHours(12, 0, 0, 0)

    await pruneOldWeekProgress(userId)

    const progressData = buildProgressData(req.body ?? {})
    const profileData = buildProfileData(req.body ?? {})
    if (Object.keys(profileData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: profileData
      })
    }

    const progress = await prisma.dailyProgress.upsert({
      where: { userId_date: { userId, date: progressDate } },
      update: { ...progressData, userId },
      create: {
        date: progressDate,
        userId,
        ...progressData
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
    const userId = (req as any).token?.userId as string | undefined
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
    const userId = (req as any).token?.userId as string | undefined
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
    res.status(500).json({ error: 'Error al obtener estadísticas de progreso' })
  }
}
