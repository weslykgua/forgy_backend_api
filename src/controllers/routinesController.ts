import { Request, Response } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getRoutines(req: Request, res: Response) {
  try {
    const userId = (req as any).token?.userId as string

    // Si no hay usuario autenticado, no se deben devolver rutinas privadas.
    if (!userId) {
      return res.json([])
    }

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
  } catch (error) {
    console.error('Error al obtener rutinas:', error)
    res.status(500).json({ error: 'Error interno al obtener rutinas' })
  }
}

export async function createRoutine(req: Request, res: Response) {
  try {
    const { name, description } = req.body
    const token = (req as any).token

    if (!token?.userId) {
      return res.status(401).json({ error: 'Autenticación requerida para crear rutinas' })
    }

    if (!name) {
      return res.status(400).json({ error: 'El nombre de la rutina es obligatorio' })
    }

    const routine = await prisma.routine.create({
      data: {
        name: name,
        userId: token.userId,
        type: 'workout',
        description: description
      }
    })
    res.status(201).json(routine)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear rutina', details: error.message })
  }
}

export async function updateRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const { name, description, isFavorite, difficulty, exercises } = req.body
    const token = (req as any).token

    if (!token?.userId) {
      return res.status(401).json({ error: 'Autenticación requerida para editar esta rutina' })
    }

    const existingRoutine = await prisma.routine.findUnique({ where: { id } })
    if (!existingRoutine) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }
    if (existingRoutine.userId !== token.userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta rutina' })
    }

    const dataToUpdate: Prisma.RoutineUpdateInput = {}
    if (name !== undefined) dataToUpdate.name = name
    if (description !== undefined) dataToUpdate.description = description
    if (isFavorite !== undefined) dataToUpdate.isFavorite = isFavorite
    if (difficulty !== undefined) dataToUpdate.difficulty = difficulty

    // Si se envía una lista de ejercicios, se asume que es para reordenar
    if (exercises && Array.isArray(exercises)) {
      await prisma.$transaction(async (tx) => {
        // 1. Eliminar las conexiones existentes
        await tx.routineExercise.deleteMany({ where: { routineId: id } })

        // 2. Crear las nuevas conexiones con el orden correcto
        if (exercises.length > 0) {
          await tx.routineExercise.createMany({
            data: exercises.map((ex: { exerciseId: string; order: number }) => ({
              routineId: id,
              exerciseId: ex.exerciseId,
              order: ex.order
            }))
          })
        }
      })
    }

    const routine = await prisma.routine.update({
      where: { id },
      data: dataToUpdate
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
    const token = (req as any).token

    if (!token?.userId) {
      return res.status(401).json({ error: 'Autenticación requerida' })
    }

    const routine = await prisma.routine.findUnique({ where: { id } })
    if (routine?.userId !== token.userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta rutina' })
    }

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
  } catch (error) {
    console.error('Error al agregar ejercicio a la rutina:', error)
    res.status(400).json({ error: 'Error al agregar ejercicio' })
  }
}

export async function removeExerciseFromRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const exerciseId = req.params.exerciseId as string
    const userId = (req as any).token?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Autenticación requerida' })
    }

    const routine = await prisma.routine.findUnique({ where: { id } })
    if (routine?.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta rutina' })
    }

    await prisma.routineExercise.deleteMany({
      where: {
        routineId: id,
        exerciseId
      }
    })

    res.json({ message: 'Ejercicio eliminado de la rutina' })
  } catch (error) {
    console.error('Error al eliminar ejercicio de la rutina:', error)
    res.status(400).json({ error: 'Error al eliminar ejercicio' })
  }
}

export async function deleteRoutine(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const userId = (req as any).token?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Autenticación requerida' })
    }

    const routineToDelete = await prisma.routine.findUnique({ where: { id } })
    if (!routineToDelete) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }
    if (routineToDelete.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta rutina' })
    }

    await prisma.routine.delete({ where: { id } })
    res.json({ message: 'Rutina eliminada' })
  } catch (error) {
    console.error('Error al eliminar rutina:', error)
    res.status(500).json({ error: 'Error interno al eliminar la rutina' })
  }
}