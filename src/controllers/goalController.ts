// ==========================
// Goal Controller
// ==========================
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RequestWithTokenInterface } from '../interfaces/RequestWithTokenInterface'

const prisma = new PrismaClient()

type PlanInput = {
  age: number
  weight: number
  height: number
  sex: 'male' | 'female' | 'other'
  goal: 'lose_weight' | 'maintain' | 'gain_muscle'
  daysPerWeek: number
  minutesPerDay: number
  equipment: string[]
  injuries: string
}

function getActivityFactor(daysPerWeek: number) {
  if (daysPerWeek <= 1) return 1.2
  if (daysPerWeek === 2) return 1.375
  if (daysPerWeek === 3) return 1.45
  if (daysPerWeek === 4) return 1.55
  if (daysPerWeek === 5) return 1.65
  return 1.75
}

function calculateNutrition(plan: PlanInput) {
  const { age, weight, height, sex, goal, daysPerWeek } = plan
  const baseBmr =
    sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161
  const tdee = baseBmr * getActivityFactor(daysPerWeek)
  const goalAdjustment = goal === 'lose_weight' ? -400 : goal === 'gain_muscle' ? 300 : 0
  const calories = Math.max(1200, Math.round(tdee + goalAdjustment))

  const proteinPerKg = goal === 'gain_muscle' ? 2.0 : goal === 'lose_weight' ? 1.8 : 1.6
  const protein = Math.round(proteinPerKg * weight)
  const fat = Math.round(0.8 * weight)
  const caloriesFromProtein = protein * 4
  const caloriesFromFat = fat * 9
  const carbs = Math.max(0, Math.round((calories - caloriesFromProtein - caloriesFromFat) / 4))

  return { calories, protein, fat, carbs }
}

function generateRoutine(plan: PlanInput) {
  const { daysPerWeek, minutesPerDay, equipment, injuries } = plan
  const hasGym = equipment.includes('gimnasio')
  const hasDumbbells = equipment.includes('mancuernas')
  const hasBands = equipment.includes('bandas')
  const hasBodyweight = equipment.includes('peso_corporal')

  const base = {
    warmup: '5-10 min movilidad + activación',
    cooldown: '5 min estiramientos'
  }

  let split: string[] = []
  if (daysPerWeek <= 2) {
    split = ['Full body A', 'Full body B']
  } else if (daysPerWeek === 3) {
    split = ['Full body A', 'Full body B', 'Full body C']
  } else if (daysPerWeek === 4) {
    split = ['Upper A', 'Lower A', 'Upper B', 'Lower B']
  } else if (daysPerWeek === 5) {
    split = ['Push', 'Pull', 'Legs', 'Upper', 'Lower']
  } else {
    split = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']
  }

  const equipmentNote = hasGym
    ? 'Enfoque gimnasio con barras y máquinas'
    : hasDumbbells
      ? 'Enfoque con mancuernas en casa'
      : hasBands
        ? 'Enfoque con bandas elásticas'
        : hasBodyweight
          ? 'Enfoque peso corporal'
          : 'Enfoque mixto básico'

  const injuryNote = injuries?.trim()
    ? `Considera limitaciones por lesiones: ${injuries}`
    : 'Sin lesiones declaradas'

  const summary = `${split.join(' / ')} · ${minutesPerDay} min · ${equipmentNote}`

  return { split, minutesPerDay, notes: [base.warmup, base.cooldown, injuryNote], summary }
}

/**
 * Obtiene las metas del usuario
 */
export async function getGoals(req: RequestWithTokenInterface, res: Response) {
  try {
    const userId = req.token.userId as string
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
export async function createGoal(req: RequestWithTokenInterface, res: Response) {
  try {
    const {
      type,
      target,
      current,
      unit,
      deadline,
      priority
    } = req.body

    const token = (req as any).token

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
export async function updateGoal(req: RequestWithTokenInterface, res: Response) {
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
export async function deleteGoal(req: RequestWithTokenInterface, res: Response) {
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
export async function getGoalsProgress(req: RequestWithTokenInterface, res: Response) {
  try {
    const userId = (req as any).token.userId as string

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

export async function getPlan(req: RequestWithTokenInterface, res: Response) {
  try {
    const userId = req.token.userId as string
    const plan = await prisma.goal.findFirst({
      where: { userId, type: 'routine_plan' }
    })
    res.json(plan || null)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener plan' })
  }
}

export async function upsertPlan(req: RequestWithTokenInterface, res: Response) {
  try {
    const userId = req.token.userId as string
    const input = req.body as PlanInput

    const nutrition = calculateNutrition(input)
    const routine = generateRoutine(input)

    const existing = await prisma.goal.findFirst({
      where: { userId, type: 'routine_plan' }
    })

    const data = {
      type: 'routine_plan',
      target: 0,
      current: 0,
      unit: 'plan',
      achieved: false,
      priority: 'high',
      planData: input,
      nutritionData: nutrition,
      routineSummary: routine.summary,
      caloriesTarget: nutrition.calories,
      proteinTarget: nutrition.protein,
      carbsTarget: nutrition.carbs,
      fatTarget: nutrition.fat,
      userId
    }

    const plan = existing
      ? await prisma.goal.update({ where: { id: existing.id }, data })
      : await prisma.goal.create({ data })

    res.json(plan)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al guardar plan' })
  }
}

export async function deletePlan(req: RequestWithTokenInterface, res: Response) {
  try {
    const userId = req.token.userId as string
    const existing = await prisma.goal.findFirst({
      where: { userId, type: 'routine_plan' }
    })
    if (!existing) return res.json({ message: 'No hay plan' })
    await prisma.goal.delete({ where: { id: existing.id } })
    res.json({ message: 'Plan eliminado' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Error al eliminar plan' })
  }
}
