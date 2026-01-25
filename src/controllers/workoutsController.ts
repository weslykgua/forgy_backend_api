import { Request, Response } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        const field = error.meta?.field_name
        return res.status(400).json({
          error: 'Error de referencia inválida',
          details: `El ID proporcionado para '${field}' no existe.`
        })
      }
    }
    res.status(400).json({ 
      error: 'Error al crear entrenamiento', 
      details: error instanceof Error ? error.message : String(error) 
    })
  }
}

export async function getWorkoutHistory(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string | undefined
    const limit = Number(req.query.limit) || 10

    const sessions = await prisma.trainingSession.findMany({
      where: userId ? { userId } : undefined,
      include: {
        workoutLogs: { include: { exercise: true } },
        routine: true
      },
      orderBy: { date: 'desc' },
      take: limit
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

export async function getWorkoutStreak(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string

    const streak = await prisma.workoutStreak.findUnique({
      where: { userId }
    })

    res.json(streak || { currentStreak: 0, longestStreak: 0 })
  } catch {
    res.status(500).json({ error: 'Error al obtener racha' })
  }
}

export async function getPersonalRecords(req: Request, res: Response) {
  try {
    const userId = req.params.userId as string
    const exerciseId = req.query.exerciseId as string | undefined

    const where: any = { userId }
    if (exerciseId) {
      where.exerciseId = exerciseId
    }

    const records = await prisma.personalRecord.findMany({
      where,
      include: { exercise: true },
      orderBy: { date: 'desc' }
    })

    // Agrupar por ejercicio y tipo
    const grouped = records.reduce((acc: any, record: any) => {
      const key = record.exerciseId
      if (!acc[key]) {
        acc[key] = {
          exerciseName: record.exercise.name,
          records: {}
        }
      }
      
      if (!acc[key].records[record.recordType] || record.value > acc[key].records[record.recordType].value) {
        acc[key].records[record.recordType] = record
      }
      
      return acc
    }, {})

    res.json(grouped)
  } catch {
    res.status(500).json({ error: 'Error al obtener récords' })
  }
}