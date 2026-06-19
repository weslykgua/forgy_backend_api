import { Router, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} from '../controllers/goalController'
import { validateToken } from '../controllers/authenticationController'
import prisma from '../config/database'

type PlanInput = {
    age: number
    weight: number
    height: number
    sex: 'male' | 'female' | 'other' | string
    goal: 'lose_weight' | 'maintain' | 'gain_muscle' | string
    daysPerWeek: number
    minutesPerDay: number
    equipment: string[]
    injuries: string
}

function resolveUserId(req: Request) {
    return req.body?.token?.userId as string | undefined
}

function toNumber(value: unknown, fallback: number) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

function buildPlan(input: PlanInput) {
    const activityMultiplier = input.daysPerWeek >= 5 ? 1.725 : input.daysPerWeek >= 4 ? 1.55 : input.daysPerWeek >= 3 ? 1.375 : 1.2
    const bmrBase = input.sex === 'female'
        ? 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
        : input.sex === 'male'
            ? 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
            : 10 * input.weight + 6.25 * input.height - 5 * input.age

    const maintenanceCalories = Math.round(bmrBase * activityMultiplier)
    const caloriesTarget = Math.max(
        1200,
        maintenanceCalories + (input.goal === 'lose_weight' ? -400 : input.goal === 'gain_muscle' ? 250 : 0)
    )
    const proteinTarget = Math.max(80, Math.round(input.weight * (input.goal === 'gain_muscle' ? 2.2 : 1.8)))
    const fatTarget = Math.max(35, Math.round((caloriesTarget * 0.25) / 9))
    const carbsTarget = Math.max(90, Math.round((caloriesTarget - proteinTarget * 4 - fatTarget * 9) / 4))

    const equipmentText = input.equipment.length > 0 ? input.equipment.join(', ') : 'peso corporal'
    const goalText = input.goal === 'lose_weight'
        ? 'pérdida de grasa'
        : input.goal === 'gain_muscle'
            ? 'ganancia muscular'
            : 'mantenimiento'

    return {
        planData: input,
        routineSummary: `Plan orientado a ${goalText} con ${input.daysPerWeek} días por semana, ${input.minutesPerDay} minutos por sesión y equipo disponible: ${equipmentText}.`,
        caloriesTarget,
        proteinTarget,
        carbsTarget,
        fatTarget,
        generatedAt: new Date().toISOString()
    }
}

export function getGoalRoutes(): Router {
    const router = Router()

    router.get('/plan', validateToken, async (req: Request, res: Response) => {
        try {
            const userId = resolveUserId(req)

            if (!userId) {
                return res.status(401).json({ error: 'No tiene permiso' })
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            })

            res.json((user as any)?.planData ?? null)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al obtener el plan' })
        }
    })

    router.post('/plan', validateToken, async (req: Request, res: Response) => {
        try {
            const userId = resolveUserId(req)

            if (!userId) {
                return res.status(401).json({ error: 'No tiene permiso' })
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { age: true, weight: true, height: true, gender: true, fitnessGoal: true }
            })

            const planInput: PlanInput = {
                age: toNumber(req.body.age, user?.age ?? 25),
                weight: toNumber(req.body.weight, user?.weight ?? 70),
                height: toNumber(req.body.height, user?.height ?? 170),
                sex: (req.body.sex || req.body.gender || user?.gender || 'other') as PlanInput['sex'],
                goal: (req.body.goal || user?.fitnessGoal || 'maintain') as PlanInput['goal'],
                daysPerWeek: toNumber(req.body.daysPerWeek, 3),
                minutesPerDay: toNumber(req.body.minutesPerDay, 45),
                equipment: Array.isArray(req.body.equipment) ? req.body.equipment.filter((item: unknown) => typeof item === 'string') : [],
                injuries: typeof req.body.injuries === 'string' ? req.body.injuries.trim() : ''
            }

            const planPayload = buildPlan(planInput)

            await prisma.user.update({
                where: { id: userId },
                data: {
                    age: planInput.age,
                    weight: planInput.weight,
                    height: planInput.height,
                    gender: planInput.sex,
                    fitnessGoal: planInput.goal,
                    activityLevel: planInput.daysPerWeek >= 5 ? 'very_active' : planInput.daysPerWeek >= 4 ? 'active' : planInput.daysPerWeek >= 3 ? 'moderate' : 'light',
                    planData: planPayload
                }
            })

            res.json(planPayload)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al guardar el plan' })
        }
    })

    router.delete('/plan', validateToken, async (req: Request, res: Response) => {
        try {
            const userId = resolveUserId(req)

            if (!userId) {
                return res.status(401).json({ error: 'No tiene permiso' })
            }

            await prisma.user.update({
                where: { id: userId },
                data: { planData: Prisma.DbNull }
            })

            res.json({ message: 'Plan eliminado correctamente' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al eliminar el plan' })
        }
    })

    /**
     * GET /api/goals
     * Query params: userId, achieved? (true/false)
     * Obtiene las metas del usuario
     */
    router.get('/', getGoals)

    /**
     * POST /api/goals
     * Body: {
     *   userId,
     *   type, (weight_loss, muscle_gain, strength, endurance, flexibility)
     *   target,
     *   current,
     *   unit?,
     *   deadline?,
     *   priority?
     * }
     * Crea una nueva meta
     */
    router.post('/', createGoal)

    /**
     * PUT /api/goals/:id
     * Body: { current?, target?, deadline?, achieved?, priority? }
     * Actualiza una meta existente
     */
    router.put('/:id', updateGoal)

    /**
     * DELETE /api/goals/:id
     * Elimina una meta
     */
    router.delete('/:id', deleteGoal)

    return router
}