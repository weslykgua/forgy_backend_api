import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getExercises(req: Request, res: Response) {
  try {
    const muscle = req.query.muscle as string | undefined
    const difficulty = req.query.difficulty as string | undefined
    const search = req.query.search as string | undefined
    const category = req.query.category as string | undefined

    const where: any = {}

    if (muscle && muscle !== 'Todos') {
      where.muscle = muscle
    }

    if (difficulty && difficulty !== 'Todos') {
      where.difficulty = difficulty
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const exercises = await prisma.exercise.findMany({ where })
    res.json(exercises)
  } catch {
    res.status(500).json({ error: 'Error al obtener ejercicios' })
  }
}

export async function getExerciseStats(req: Request, res: Response) {
  try {
    const [byMuscle, byDifficulty, total] = await Promise.all([
      prisma.exercise.groupBy({
        by: ['muscle'],
        _count: true
      }),
      prisma.exercise.groupBy({
        by: ['difficulty'],
        _count: true
      }),
      prisma.exercise.count()
    ])

    res.json({
      totalExercises: total,
      byMuscle,
      byDifficulty
    })
  } catch {
    res.status(500).json({ error: 'Error al generar estadísticas' })
  }
}
