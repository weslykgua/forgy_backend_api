import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getRoutines(req: Request, res: Response) {
  try {
    const userId = req.body.token?.userId as string

    const routines = await prisma.routine.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { exercises: true, sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(routines)
  } catch {
    res.status(500).json({ error: 'Error al obtener rutinas' })
  }
}

export async function createRoutine(req: Request, res: Response) {
  try {
    const { name, description, token } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nombre es obligatorios' })
    }
    console.log("Rutina entro");
    
    const routine = await prisma.routine.create({
      data: {
        name: name,
        userId: token.userId,
        type: "workout",
        description: description
        //difficulty: difficulty
      }
    })
    // ToDo convertir userId desde json web token
    res.status(201).json(routine)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear rutina', details: error.message })
    console.log("Rutina, error", error);
    
  }
}

export async function updateRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const { name, description, isFavorite, difficulty, token } = req.body

    const existingRoutine = await prisma.routine.findUnique({ where: { id } })
    if (!existingRoutine) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }
    if (existingRoutine.userId !== token.userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta rutina' })
    }

    const routine = await prisma.routine.update({
      where: { id },
      data: { name, description, isFavorite, difficulty }
    })

    res.json(routine)
  } catch (error) {
    console.error('Error al actualizar rutina:', error)
    res.status(500).json({ error: 'Error interno al actualizar la rutina' })
  }
}

export async function addExerciseToRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const { exerciseId, order, targetSets, targetReps, targetWeight, restTime, notes } = req.body

    const routineExercise = await prisma.routineExercise.create({
      data: {
        routineId: id,
        exerciseId,
        order,
        targetSets,
        targetReps,
        targetWeight,
        restTime,
        notes
      }
    })

    res.json(routineExercise)
  } catch {
    res.status(400).json({ error: 'Error al agregar ejercicio' })
  }
}

export async function removeExerciseFromRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const exerciseId = req.params.exerciseId as string

    await prisma.routineExercise.deleteMany({
      where: {
        routineId: id,
        exerciseId
      }
    })

    res.json({ message: 'Ejercicio eliminado de la rutina' })
  } catch {
    res.status(400).json({ error: 'Error al eliminar ejercicio' })
  }
}

export async function deleteRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const userId = req.body.token.userId

    const routine = await prisma.routine.findUnique({ where: { id } })
    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }
    if (routine.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta rutina' })
    }

    await prisma.routine.delete({ where: { id } })
    res.json({ message: 'Rutina eliminada' })
  } catch (error) {
    console.error('Error al eliminar rutina:', error)
    res.status(500).json({ error: 'Error interno al eliminar la rutina' })
  }
}