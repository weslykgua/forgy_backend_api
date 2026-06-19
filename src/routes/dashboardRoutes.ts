import { Router, Request, Response } from 'express'
import { validateToken } from '../controllers/authenticationController'
import prisma from '../config/database'

function resolveUserId(req: Request) {
    return req.body?.token?.userId as string | undefined
}

function toDateKey(date: Date) {
    return date.toISOString().slice(0, 10)
}

export function getDashboardRoutes() {
    const router = Router()

    router.get('/', validateToken, async (req: Request, res: Response) => {
        try {
            const userId = resolveUserId(req)

            if (!userId) {
                return res.status(401).json({ error: 'No tiene permiso' })
            }

            const since30Days = new Date()
            since30Days.setDate(since30Days.getDate() - 30)

            const [totalWorkouts, recentWorkouts, avgDuration, totalVolume, streak, recentRecords, activityCalendar] = await Promise.all([
                prisma.trainingSession.count({ where: { userId } }),
                prisma.trainingSession.count({ where: { userId, date: { gte: since30Days } } }),
                prisma.trainingSession.aggregate({ where: { userId }, _avg: { duration: true } }),
                prisma.trainingSession.aggregate({ where: { userId }, _sum: { totalVolume: true } }),
                prisma.workoutStreak.findUnique({
                    where: { userId },
                    select: { currentStreak: true, longestStreak: true }
                }),
                prisma.personalRecord.findMany({
                    where: { userId },
                    orderBy: { date: 'desc' },
                    take: 5,
                    include: { exercise: true }
                }),
                prisma.trainingSession.findMany({
                    where: { userId, date: { gte: since30Days } },
                    orderBy: { date: 'asc' },
                    select: { date: true, duration: true, totalVolume: true }
                })
            ])

            const groupedCalendar = activityCalendar.reduce<Record<string, { hasWorkout: boolean; workouts: number; totalVolume: number }>>((acc, session) => {
                const key = toDateKey(session.date)
                acc[key] = {
                    hasWorkout: true,
                    workouts: (acc[key]?.workouts || 0) + 1,
                    totalVolume: (acc[key]?.totalVolume || 0) + Number(session.totalVolume || 0)
                }
                return acc
            }, {})

            res.json({
                totalWorkouts,
                last30DaysWorkouts: recentWorkouts,
                avgDuration: Math.round(avgDuration._avg.duration || 0),
                currentStreak: streak?.currentStreak || 0,
                longestStreak: streak?.longestStreak || 0,
                totalVolume: totalVolume._sum.totalVolume || 0,
                recentRecords: recentRecords.map((record) => ({
                    id: record.id,
                    exerciseId: record.exerciseId,
                    exerciseName: record.exercise.name,
                    recordType: record.recordType,
                    value: record.value,
                    reps: record.reps,
                    weight: record.weight,
                    date: record.date
                })),
                activityCalendar: groupedCalendar
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al obtener el dashboard' })
        }
    })

    return router
}