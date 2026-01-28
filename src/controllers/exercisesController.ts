import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getExercises(req: Request, res: Response) {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(exercises)
  } catch (error) {
    console.error('Error getting exercises:', error)
    res.status(500).json({ error: 'Error al obtener ejercicios' })
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const totalExercises = await prisma.exercise.count()

    // Agrupar por músculo
    const byMuscleRaw = await prisma.exercise.groupBy({
      by: ['muscle'],
      _count: { _all: true }
    })
    const byMuscle = byMuscleRaw.reduce((acc, curr) => {
      acc[curr.muscle] = curr._count._all
      return acc
    }, {} as Record<string, number>)

    // Agrupar por dificultad
    const byDifficultyRaw = await prisma.exercise.groupBy({
      by: ['difficulty'],
      _count: { _all: true }
    })
    const byDifficulty = byDifficultyRaw.reduce((acc, curr) => {
      const key = curr.difficulty || 'Desconocido'
      acc[key] = curr._count._all
      return acc
    }, {} as Record<string, number>)

    res.json({ totalExercises, byMuscle, byDifficulty })
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

export async function createExercise(req: Request, res: Response) {
  try {
    const { name, muscle, video, description, difficulty, equipment, instructions } = req.body

    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscle,
        video,
        description,
        difficulty,
        equipment,
        instructions: instructions || []
      }
    })

    res.status(201).json(exercise)
  } catch (error) {
    console.error('Error creating exercise:', error)
    res.status(500).json({ error: 'Error al crear el ejercicio' })
  }
}

export async function updateExercise(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const data = req.body
    delete (data as any).id
    delete (data as any).createdAt

    const exercise = await prisma.exercise.update({ where: { id }, data })
    res.json(exercise)
  } catch (error) {
    console.error('Error updating exercise:', error)
    res.status(500).json({ error: 'Error al actualizar el ejercicio' })
  }
}

export async function deleteExercise(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    await prisma.exercise.delete({ where: { id } })
    res.json({ message: 'Ejercicio eliminado' })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    res.status(500).json({ error: 'Error al eliminar el ejercicio' })
  }
}