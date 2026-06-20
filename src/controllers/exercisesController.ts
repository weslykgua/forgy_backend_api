import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import prisma from '../config/database'

export async function getExercises(req: Request, res: Response) {
  try {
    const muscle = req.query.muscle as string | undefined
    const difficulty = req.query.difficulty as string | undefined
    const search = req.query.search as string | undefined
    const category = req.query.category as string | undefined
    const page = parseInt(req.query.page as string || '1', 10)
    const limit = parseInt(req.query.limit as string || '50', 10)
    const paginate = req.query.paginate !== 'false' // default to paginated

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

    if (!paginate) {
      // Legacy: return all (for backward compat with routines hydration)
      const exercises = await prisma.exercise.findMany({ where, select: { id: true, name: true, muscle: true, difficulty: true, equipment: true } })
      return res.json(exercises)
    }

    const skip = (page - 1) * limit
    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      prisma.exercise.count({ where })
    ])

    res.json({
      data: exercises,
      total,
      page,
      limit,
      hasMore: skip + exercises.length < total
    })
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

export async function seedExercises(req: Request, res: Response) {
  try {
    const { seedExercisesIfNeeded } = require('../utils/seeder')
    const force = req.query.force === 'true'
    await seedExercisesIfNeeded(force)
    res.json({ success: true, message: 'Ejercicios sembrados exitosamente' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al sembrar la base de datos: ' + error.message })
  }
}
