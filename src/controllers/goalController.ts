// ==========================
// Goal Controller
// ==========================
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Obtiene las metas del usuario
 */
export async function getGoals(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string
    const achieved = req.query.achieved as string | undefined

    const where: any = {}
    where.userId = userId

    if (achieved !== undefined) {
      where.achieved = achieved === 'true'
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: [
        { achieved: 'asc' },  // No cumplidas primero
        { priority: 'asc' },  // Alta prioridad primero
        { deadline: 'asc' }   // Más próximas primero
      ]
    })

    res.json(goals)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener metas' })
  }
}

/**
 * Crea una nueva meta
 */
export async function createGoal(req: Request, res: Response) {
  try {
    const { 
      token,
      type, 
      target, 
      current, 
      unit, 
      deadline, 
      priority 
    } = req.body

    if (!token.userId || !type || target === undefined || current === undefined) {
      return res.status(400).json({ 
        error: 'userId, type, target y current son obligatorios' 
      })
    }

    const goal = await prisma.goal.create({
      data: {
        userId: token.userId,
        type,
        target,
        current,
        unit,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'medium'
      }
    })

    res.status(201).json(goal)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al crear meta' })
  }
}

/**
 * Actualiza una meta existente
 */
export async function updateGoal(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const { current, target, deadline, achieved, priority } = req.body

    const data: any = {}

    if (current !== undefined) data.current = current
    if (target !== undefined) data.target = target
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null
    if (achieved !== undefined) data.achieved = achieved
    if (priority !== undefined) data.priority = priority

    const goal = await prisma.goal.update({
      where: { id },
      data
    })

    res.json(goal)
  } catch (error) {
    console.error(error)
    res.status(404).json({ error: 'Meta no encontrada' })
  }
}

/**
 * Elimina una meta
 */
export async function deleteGoal(req: Request, res: Response) {
  try {
    const id = req.params.id as string

    await prisma.goal.delete({
      where: { id }
    })

    res.json({ message: 'Meta eliminada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(404).json({ error: 'Meta no encontrada' })
  }
}

/**
 * Obtiene el progreso de todas las metas activas
 */
export async function getGoalsProgress(req: Request, res: Response) {
  try {
    const userId = req.body.token.userId as string

    const goals = await prisma.goal.findMany({
      where: {
        userId,
        achieved: false
      }
    })

    const goalsWithProgress = goals.map((goal: any) => {
      const progress = (goal.current / goal.target) * 100
      const daysLeft = goal.deadline 
        ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

      return {
        ...goal,
        progress: Math.min(progress, 100),
        daysLeft,
        status: progress >= 100 
          ? 'completed' 
          : daysLeft && daysLeft < 0 
            ? 'overdue' 
            : daysLeft && daysLeft <= 7 
              ? 'urgent' 
              : 'on_track'
      }
    })

    res.json(goalsWithProgress)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener progreso de metas' })
  }
}