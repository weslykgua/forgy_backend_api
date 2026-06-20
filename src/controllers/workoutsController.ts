import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { updateWorkoutStreak } from './streakController'
import { checkAndUpdateRecords } from './recordsController'

type WorkoutSet = {
  reps: number
  weight: number
  completed?: boolean
  rpe?: number
}

type WorkoutInput = {
  exerciseId: string
  sets: WorkoutSet[]
  notes?: string
  duration?: number | null
}

function resolveUserId(req: Request) {
  return req.body?.token?.userId as string | undefined
}

function getWorkoutInputs(reqBody: any): WorkoutInput[] {
  if (Array.isArray(reqBody.workouts) && reqBody.workouts.length > 0) {
    return reqBody.workouts
  }

  if (reqBody.exerciseId) {
    return [{
      exerciseId: reqBody.exerciseId,
      sets: Array.isArray(reqBody.sets) ? reqBody.sets : [],
      notes: reqBody.notes,
      duration: reqBody.duration ?? null
    }]
  }

  return []
}

function calculateWorkoutVolume(workouts: WorkoutInput[]) {
  return workouts.reduce((total, workout) => {
    return total + workout.sets.reduce((setTotal, set) => {
      if (set.completed === false || !set.weight || !set.reps) {
        return setTotal
      }

      return setTotal + set.weight * set.reps
    }, 0)
  }, 0)
}

function toLocalDateKey(date: Date) {
  return new Date(date).toLocaleDateString('en-CA')
}

function flattenSession(session: any) {
  const workoutLog = session.workoutLogs?.[0]

  return {
    id: session.id,
    date: session.date,
    exerciseId: workoutLog?.exerciseId,
    exerciseName: workoutLog?.exercise?.name ?? 'Ejercicio',
    duration: workoutLog?.duration ?? session.duration ?? 0,
    notes: workoutLog?.notes ?? session.notes ?? '',
    sets: Array.isArray(workoutLog?.sets) ? workoutLog.sets : [],
    totalVolume: session.totalVolume ?? calculateWorkoutVolume(workoutLog ? [{
      exerciseId: workoutLog.exerciseId,
      sets: Array.isArray(workoutLog.sets) ? workoutLog.sets : [],
      notes: workoutLog.notes,
      duration: workoutLog.duration
    }] : []),
    routineId: session.routineId ?? null,
    routineName: session.routine?.name ?? null
  }
}

export async function createWorkout(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)
    const { routineId, duration, rating, notes, date } = req.body
    const workouts = getWorkoutInputs(req.body)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    if (workouts.length === 0) {
      return res.status(400).json({ error: 'Debes enviar al menos un ejercicio' })
    }

    // Calcular volumen total
    const totalVolume = calculateWorkoutVolume(workouts)

    const session = await prisma.trainingSession.create({
      data: {
        userId,
        routineId,
        date: date ? new Date(date) : new Date(),
        duration,
        totalVolume,
        rating,
        notes,
        workoutLogs: {
          create: workouts.map((workout: WorkoutInput) => ({
            exerciseId: workout.exerciseId,
            sets: workout.sets,
            notes: workout.notes,
            duration: workout.duration ?? duration ?? null
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

    res.status(201).json(flattenSession(session))
  } catch (error) {
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Foreign key constraint failed (e.g., userId or routineId does not exist)
      if (error.code === 'P2003') {
        const field = error.meta?.field_name;
        return res.status(400).json({
          error: `Error de referencia inválida`,
          details: `El ID proporcionado para '${field}' no existe.`
        });
      }
    }
    // Generic error
    res.status(400).json({ error: 'Error al crear entrenamiento', details: error instanceof Error ? error.message : String(error) })
  }
}

export async function getWorkoutHistory(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)
    const limit = Number(req.query.limit) || 10

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const sessions = await prisma.trainingSession.findMany({
      where: { userId: String(userId) },
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

export async function getWorkoutsByDate(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)
    const dateParam = req.query.date as string | undefined

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    if (!dateParam) {
      return res.status(400).json({ error: 'La fecha es obligatoria' })
    }

    const targetDate = new Date(dateParam)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const sessions = await prisma.trainingSession.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        workoutLogs: { include: { exercise: true } },
        routine: true
      },
      orderBy: { date: 'asc' }
    })

    const workouts = sessions.map((session) => flattenSession(session))
    res.json(workouts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener entrenamientos del día' })
  }
}

export async function getWorkoutCalendar(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const sessions = await prisma.trainingSession.findMany({
      where: { userId },
      select: {
        date: true,
        totalVolume: true
      }
    })

    const calendar = sessions.reduce<Record<string, { hasWorkout: boolean; workouts: number; totalVolume: number }>>((acc, session) => {
      const key = toLocalDateKey(session.date)
      acc[key] = {
        hasWorkout: true,
        workouts: (acc[key]?.workouts || 0) + 1,
        totalVolume: (acc[key]?.totalVolume || 0) + Number(session.totalVolume || 0)
      }
      return acc
    }, {})

    res.json(calendar)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el calendario' })
  }
}

export async function updateWorkout(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)
    const workoutId = String(req.params.id)
    const workouts = getWorkoutInputs(req.body)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    if (workouts.length === 0) {
      return res.status(400).json({ error: 'Debes enviar al menos un ejercicio' })
    }

    const existingSession = await prisma.trainingSession.findUnique({
      where: { id: workoutId },
      include: { workoutLogs: true }
    })

    if (!existingSession || existingSession.userId !== userId) {
      return res.status(404).json({ error: 'Entrenamiento no encontrado' })
    }

    const totalVolume = calculateWorkoutVolume(workouts)
    const nextDate = req.body.date ? new Date(req.body.date) : existingSession.date

    const updatedSession = await prisma.$transaction(async (tx) => {
      await tx.trainingSession.update({
        where: { id: workoutId },
        data: {
          date: nextDate,
          routineId: req.body.routineId ?? existingSession.routineId,
          duration: req.body.duration ?? existingSession.duration,
          totalVolume,
          rating: req.body.rating ?? existingSession.rating,
          notes: req.body.notes ?? existingSession.notes
        }
      })

      await tx.workoutLog.deleteMany({ where: { trainingSessionId: workoutId } })

      await tx.workoutLog.createMany({
        data: workouts.map((workout: WorkoutInput) => ({
          trainingSessionId: workoutId,
          exerciseId: workout.exerciseId,
          sets: workout.sets,
          notes: workout.notes,
          duration: workout.duration ?? req.body.duration ?? null
        }))
      })

      return tx.trainingSession.findUnique({
        where: { id: workoutId },
        include: {
          workoutLogs: { include: { exercise: true } },
          routine: true
        }
      })
    })

    res.json(flattenSession(updatedSession))
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al actualizar entrenamiento' })
  }
}

export async function deleteWorkout(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req)
    const workoutId = String(req.params.id)

    if (!userId) {
      return res.status(401).json({ error: 'No tiene permiso' })
    }

    const existingSession = await prisma.trainingSession.findUnique({
      where: { id: workoutId },
      select: { userId: true }
    })

    if (!existingSession || existingSession.userId !== userId) {
      return res.status(404).json({ error: 'Entrenamiento no encontrado' })
    }

    await prisma.trainingSession.delete({ where: { id: workoutId } })
    res.json({ message: 'Entrenamiento eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al eliminar entrenamiento' })
  }
}
