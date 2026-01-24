import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { updateWorkoutStreak } from './streakController'
import { checkAndUpdateRecords } from './recordsController'

const prisma = new PrismaClient()

export async function createWorkout(req: Request, res: Response) {
  try {
    const { userId, routineId, duration, workouts, rating, notes } = req.body

    // Calcular volumen total
    let totalVolume = 0
    workouts.forEach((w: any) => {
      w.sets.forEach((s: any) => {
        if (s.completed && s.weight && s.reps) {
          totalVolume += s.weight * s.reps
        }
      })
    })

    const session = await prisma.trainingSession.create({
      data: {
        userId,
        routineId,
        date: new Date(),
        duration,
        totalVolume,
        rating,
        notes,
        workoutLogs: {
          create: workouts.map((w: any) => ({
            exerciseId: w.exerciseId,
            sets: w.sets,
            notes: w.notes,
            duration: w.duration
          }))
        }
      },
      include: {
        workoutLogs: {
          include: { exercise: true }
        }
      }
    })

    // Actualizar racha
    await updateWorkoutStreak(userId)

    // Revisar y actualizar récords personales
    await checkAndUpdateRecords(userId, workouts)

    res.status(201).json(session)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al crear entrenamiento' })
  }
}

export async function getWorkoutHistory(req: Request, res: Response) {
  try {
    const { userId, limit = 10 } = req.query

    const sessions = await prisma.trainingSession.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      include: {
        workoutLogs: { include: { exercise: true } },
        routine: true
      },
      orderBy: { date: 'desc' },
      take: Number(limit)
    })

    const history = sessions.map((session: any) => ({
      id: session.id,
      date: session.date,
      routine: session.routine?.name ?? 'Entrenamiento Libre',
      exerciseCount: session.workoutLogs.length,
      totalVolume: session.totalVolume,
      duration: session.duration,
      rating: session.rating,
      exercises: session.workoutLogs.map((log: any) => ({
        name: log.exercise.name,
        sets: log.sets
      }))
    }))

    res.json(history)
  } catch {
    res.status(500).json({ error: 'Error al obtener historial' })
  }
}
