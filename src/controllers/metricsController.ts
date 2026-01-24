import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string // ✅ Asegura que es string
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      totalWorkouts,
      recentSessions,
      streak,
      totalVolume,
      records
    ] = await Promise.all([
      prisma.trainingSession.count({ where: { userId } }),
      prisma.trainingSession.findMany({
        where: {
          userId,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'desc' },
        take: 30
      }),
      prisma.workoutStreak.findUnique({ where: { userId } }),
      prisma.trainingSession.aggregate({
        where: { userId },
        _sum: { totalVolume: true }
      }),
      prisma.personalRecord.findMany({
        where: { userId },
        include: { exercise: true },
        orderBy: { date: 'desc' },
        take: 5
      })
    ])

    // Calcular estadísticas de los últimos 30 días
    const last30DaysWorkouts = recentSessions.length
    const avgDuration = recentSessions.reduce((sum: any, s: any) => sum + (s.duration || 0), 0) / (last30DaysWorkouts || 1)

    // Crear calendario de actividad
    const activityCalendar = recentSessions.map((s: any) => ({
      date: s.date,
      workouts: 1,
      volume: s.totalVolume || 0,
      duration: s.duration || 0
    }))

    res.json({
      totalWorkouts,
      last30DaysWorkouts,
      avgDuration: Math.round(avgDuration),
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      totalVolume: totalVolume._sum.totalVolume || 0,
      recentRecords: records,
      activityCalendar
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener métricas' })
  }
}