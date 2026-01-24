import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- GET: Listar entrenamientos con filtros ---
export async function getWorkouts(req: Request, res: Response) {
  try {
    const { date, startDate, endDate } = req.query
    const where: any = {}

    if (date) {
      where.date = date as string
    } else if (startDate && endDate) {
      where.date = { gte: startDate as string, lte: endDate as string }
    }

    const workouts = await prisma.workoutLog.findMany({
      where,
      include: { sets: true }, // Traemos los sets asociados
      orderBy: { date: 'desc' }
    })
    res.json(workouts)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener entrenamientos' })
  }
}

// --- GET: Por ID ---
export async function getWorkoutById(req: Request, res: Response) {
  try {
    const workout = await prisma.workoutLog.findUnique({
      where: { id: req.params.id },
      include: { sets: true }
    })
    if (!workout) return res.status(404).json({ error: 'Entrenamiento no encontrado' })
    res.json(workout)
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

// --- POST: Crear entrenamiento y sus sets ---
export async function createWorkout(req: Request, res: Response) {
  try {
    const { sets, ...rest } = req.body
    
    // Prisma permite crear el entrenamiento y sus sets en una sola operación (Nested Write)
    const newWorkout = await prisma.workoutLog.create({
      data: {
        ...rest,
        date: rest.date || new Date().toISOString().split('T')[0],
        sets: {
          create: sets // Asumiendo que enviamos un array de sets
        }
      },
      include: { sets: true }
    })
    res.status(201).json(newWorkout)
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el registro' })
  }
}

// --- GET: Historial agrupado ---
export async function getWorkoutHistory(req: Request, res: Response) {
  try {
    const workouts = await prisma.workoutLog.findMany({
      include: { sets: true },
      orderBy: { date: 'desc' },
      take: 50 // Limitamos para rendimiento
    })

    const grouped: any = {}

    workouts.forEach((w) => {
      if (!grouped[w.date]) {
        grouped[w.date] = { workouts: [], totalVolume: 0, totalDuration: 0 }
      }
      const volume = w.sets.reduce((acc: number, s: any) => acc + (s.reps * s.weight), 0)
      grouped[w.date].workouts.push(w)
      grouped[w.date].totalVolume += volume
      grouped[w.date].totalDuration += w.duration
    })

    const history = Object.entries(grouped).map(([date, data]: [string, any]) => ({
      date,
      exerciseCount: data.workouts.length,
      totalVolume: Math.round(data.totalVolume),
      totalDuration: data.totalDuration,
      workouts: data.workouts,
    }))

    res.json(history)
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar historial' })
  }
}

// --- DELETE: Borrar entrenamiento ---
export async function deleteWorkout(req: Request, res: Response) {
  try {
    // Si usas "onDelete: Cascade" en Prisma, borrará los sets automáticamente
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    await prisma.workoutLog.delete({
      where: { id }
    })
    res.json({ message: 'Entrenamiento eliminado' })
  } catch (error) {
    res.status(404).json({ error: 'No encontrado' })
  }
}