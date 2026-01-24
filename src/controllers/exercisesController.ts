import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- GET: Listar con filtros ---
export async function getExercises(req: Request, res: Response) {
  try {
    const { muscle, difficulty, search } = req.query

    // Construimos el objeto de filtros dinámicamente
    const where: any = {}

    if (muscle && muscle !== 'Todos') {
      where.muscle = muscle as string
    }
    if (difficulty && difficulty !== 'Todos') {
      where.difficulty = difficulty as string
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const exercises = await prisma.exercise.findMany({ where })
    res.json(exercises)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' })
  }
}

// --- GET: Estadísticas ---
export async function getStatsRequest(req: Request, res: Response) {
  try {
    const exercises = await prisma.exercise.findMany()

    const byMuscle: Record<string, number> = {}
    const byDifficulty: Record<string, number> = {}

    exercises.forEach((ex) => {
      if (ex.muscle) {
        byMuscle[ex.muscle] = (byMuscle[ex.muscle] || 0) + 1
      }
      if (ex.difficulty) {
        byDifficulty[ex.difficulty] = (byDifficulty[ex.difficulty] || 0) + 1
      }
    })
    res.json({
      totalExercises: exercises.length,
      byMuscle,
      byDifficulty,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al generar estadísticas' })
  }
}