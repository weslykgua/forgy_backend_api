import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface UserData {
  user: any
  recentWorkouts: any[]
  goals: any[]
  progress: any[]
  measurements: any[]
  streak: any
  records: any[]
}

/**
 * Genera recomendaciones personalizadas basadas en datos del usuario
 */
export async function generateRecommendations(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string

    // Obtener todos los datos relevantes del usuario
    const userData = await gatherUserData(userId)

    // Generar diferentes tipos de recomendaciones
    const recommendations = [
      ...await generateWorkoutRecommendations(userData),
      ...await generateRecoveryRecommendations(userData),
      ...await generateGoalRecommendations(userData),
      ...await generateProgressRecommendations(userData)
    ]

    // Guardar recomendaciones en la base de datos
    for (const rec of recommendations) {
      await prisma.aIRecommendation.create({
        data: {
          userId,
          type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          basedOn: rec.basedOn,
          confidence: rec.confidence,
          expiresAt: rec.expiresAt
        }
      })
    }

    res.json(recommendations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al generar recomendaciones' })
  }
}

/**
 * Obtiene todas las recomendaciones activas del usuario
 */
export async function getRecommendations(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string
    const status = (req.query.status as string) || 'pending'

    const recommendations = await prisma.aIRecommendation.findMany({
      where: {
        userId,
        status,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    res.json(recommendations)
  } catch {
    res.status(500).json({ error: 'Error al obtener recomendaciones' })
  }
}

/**
 * Actualiza el estado de una recomendación
 */
export async function updateRecommendationStatus(req: Request, res: Response) {
  try {
    const id = req.params.id as string
    const { status } = req.body

    const recommendation = await prisma.aIRecommendation.update({
      where: { id },
      data: {
        status,
        dismissedAt: status === 'dismissed' ? new Date() : undefined
      }
    })

    res.json(recommendation)
  } catch {
    res.status(404).json({ error: 'Recomendación no encontrada' })
  }
}

// ==========================
// Helper Functions
// ==========================

async function gatherUserData(userId: string): Promise<UserData> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [user, recentWorkouts, goals, progress, measurements, streak, records] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.trainingSession.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo }
      },
      include: {
        workoutLogs: {
          include: { exercise: true }
        }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.goal.findMany({
      where: { userId, achieved: false }
    }),
    prisma.dailyProgress.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5
    }),
    prisma.workoutStreak.findUnique({ where: { userId } }),
    prisma.personalRecord.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 10
    })
  ])

  return { user, recentWorkouts, goals, progress, measurements, streak, records }
}

async function generateWorkoutRecommendations(data: UserData) {
  const recommendations = []
  const now = new Date()

  // 1. Verificar si está entrenando regularmente
  if (data.recentWorkouts.length < 8) {
    recommendations.push({
      type: 'workout',
      title: 'Aumenta tu frecuencia de entrenamiento',
      description: `Has entrenado ${data.recentWorkouts.length} veces en los últimos 30 días. Para mejores resultados, intenta entrenar al menos 3-4 veces por semana.`,
      priority: 'high',
      basedOn: { workoutCount: data.recentWorkouts.length, period: '30 days' },
      confidence: 0.9,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
  }

  // 2. Detectar desequilibrios musculares
  const muscleGroups = data.recentWorkouts
    .flatMap(w => w.workoutLogs.map((l: any) => l.exercise.muscle))
    .reduce((acc: any, muscle: string) => {
      acc[muscle] = (acc[muscle] || 0) + 1
      return acc
    }, {})

  const totalExercises = Object.values(muscleGroups).reduce((a: any, b: any) => a + b, 0) as number

  if (totalExercises > 0) {
    const undertrainedMuscles = Object.entries(muscleGroups)
      .filter(([_, count]) => (count as number) / totalExercises < 0.1)
      .map(([muscle]) => muscle)

    if (undertrainedMuscles.length > 0) {
      recommendations.push({
        type: 'workout',
        title: 'Equilibra tu entrenamiento',
        description: `Has estado entrenando poco estos grupos musculares: ${undertrainedMuscles.join(', ')}. Considera agregar ejercicios para estos músculos.`,
        priority: 'medium',
        basedOn: { muscleDistribution: muscleGroups },
        confidence: 0.85,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      })
    }
  }

  // 3. Recomendar progresión
  const recentVolumes = data.recentWorkouts
    .filter(w => w.totalVolume)
    .map(w => w.totalVolume)
    .slice(0, 5)

  if (recentVolumes.length >= 3) {
    const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length
    const isStagnant = recentVolumes.every(v => Math.abs(v - avgVolume) / avgVolume < 0.1)

    if (isStagnant) {
      recommendations.push({
        type: 'workout',
        title: 'Es hora de progresar',
        description: 'Tu volumen de entrenamiento ha sido consistente. Considera aumentar el peso, repeticiones o series para seguir progresando.',
        priority: 'medium',
        basedOn: { volumeProgression: recentVolumes },
        confidence: 0.8,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      })
    }
  }

  return recommendations
}

async function generateRecoveryRecommendations(data: UserData) {
  const recommendations = []
  const now = new Date()

  // 1. Verificar sueño
  const recentSleep = data.progress
    .filter(p => p.sleepHours)
    .slice(0, 7)

  if (recentSleep.length >= 3) {
    const avgSleep = recentSleep.reduce((sum, p) => sum + (p.sleepHours || 0), 0) / recentSleep.length

    if (avgSleep < 7) {
      recommendations.push({
        type: 'recovery',
        title: 'Mejora tu descanso',
        description: `Tu promedio de sueño es de ${avgSleep.toFixed(1)} horas. Para una óptima recuperación, intenta dormir 7-9 horas por noche.`,
        priority: 'high',
        basedOn: { avgSleep, recentDays: 7 },
        confidence: 0.9,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      })
    }
  }

  // 2. Detectar sobreentrenamiento
  const lastWeekWorkouts = data.recentWorkouts.filter(w => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(w.date) >= weekAgo
  })

  if (lastWeekWorkouts.length >= 6) {
    const ratingsWithValue = lastWeekWorkouts.filter(w => w.rating)

    if (ratingsWithValue.length > 0) {
      const avgRating = ratingsWithValue.reduce((sum, w) => sum + w.rating, 0) / ratingsWithValue.length

      if (avgRating < 3) {
        recommendations.push({
          type: 'recovery',
          title: 'Considera un día de descanso',
          description: 'Has entrenado mucho esta semana y tus valoraciones han sido bajas. Tu cuerpo podría necesitar recuperación.',
          priority: 'high',
          basedOn: { weeklyWorkouts: lastWeekWorkouts.length, avgRating },
          confidence: 0.85,
          expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        })
      }
    }
  }

  // 3. Hidratación
  const recentWater = data.progress
    .filter(p => p.waterIntake)
    .slice(0, 7)

  if (recentWater.length >= 3) {
    const avgWater = recentWater.reduce((sum, p) => sum + (p.waterIntake || 0), 0) / recentWater.length

    if (avgWater < 2000) {
      recommendations.push({
        type: 'recovery',
        title: 'Aumenta tu hidratación',
        description: `Tu consumo promedio de agua es ${Math.round(avgWater)}ml. Intenta llegar a 2-3 litros diarios para mejor rendimiento.`,
        priority: 'medium',
        basedOn: { avgWaterIntake: avgWater },
        confidence: 0.8,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      })
    }
  }

  return recommendations
}

async function generateGoalRecommendations(data: UserData) {
  const recommendations = []
  const now = new Date()

  for (const goal of data.goals) {
    const progress = ((goal.current / goal.target) * 100).toFixed(1)
    const daysLeft = goal.deadline
      ? Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Meta cerca de cumplirse
    if (goal.current / goal.target >= 0.9) {
      recommendations.push({
        type: 'goal',
        title: '¡Casi logras tu meta!',
        description: `Estás al ${progress}% de tu meta de ${goal.type}. ¡Sigue así!`,
        priority: 'high',
        basedOn: { goalId: goal.id, progress: parseFloat(progress) },
        confidence: 1,
        expiresAt: goal.deadline
      })
    }

    // Meta con deadline próximo
    if (daysLeft && daysLeft <= 7 && goal.current / goal.target < 0.8) {
      recommendations.push({
        type: 'goal',
        title: 'Acelera para alcanzar tu meta',
        description: `Te quedan ${daysLeft} días para tu meta de ${goal.type}. Estás al ${progress}%. Necesitas esforzarte más.`,
        priority: 'high',
        basedOn: { goalId: goal.id, daysLeft, progress: parseFloat(progress) },
        confidence: 0.9,
        expiresAt: goal.deadline
      })
    }

    // Meta estancada
    if (goal.current === 0 || goal.current / goal.target < 0.1) {
      recommendations.push({
        type: 'goal',
        title: 'Comienza a trabajar en tu meta',
        description: `Tu meta de ${goal.type} no ha tenido mucho progreso. Crea un plan específico para alcanzarla.`,
        priority: 'medium',
        basedOn: { goalId: goal.id, progress: parseFloat(progress) },
        confidence: 0.75,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      })
    }
  }

  return recommendations
}

async function generateProgressRecommendations(data: UserData) {
  const recommendations = []
  const now = new Date()

  // 1. Peso corporal
  if (data.measurements.length >= 2) {
    const latest = data.measurements[0]
    const previous = data.measurements[1]

    if (latest.weight && previous.weight) {
      const weightChange = latest.weight - previous.weight
      const weeksDiff = Math.abs(
        (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24 * 7)
      )

      if (data.user?.fitnessGoal === 'lose_weight' && weightChange > 0) {
        recommendations.push({
          type: 'nutrition',
          title: 'Ajusta tu nutrición',
          description: `Has ganado ${weightChange.toFixed(1)}kg en ${weeksDiff.toFixed(0)} semanas. Para perder peso, considera revisar tu déficit calórico.`,
          priority: 'high',
          basedOn: { weightChange, weeksDiff, goal: 'lose_weight' },
          confidence: 0.85,
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        })
      }

      if (data.user?.fitnessGoal === 'gain_muscle' && weightChange < -0.5) {
        recommendations.push({
          type: 'nutrition',
          title: 'Aumenta tu ingesta calórica',
          description: `Has perdido ${Math.abs(weightChange).toFixed(1)}kg. Para ganar músculo, necesitas un superávit calórico.`,
          priority: 'high',
          basedOn: { weightChange, weeksDiff, goal: 'gain_muscle' },
          confidence: 0.85,
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        })
      }
    }
  }

  // 2. Records personales
  const recentRecords = data.records.filter(r => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(r.date) >= thirtyDaysAgo
  })

  if (recentRecords.length >= 2) {
    recommendations.push({
      type: 'progress',
      title: '¡Excelente progreso!',
      description: `Has establecido ${recentRecords.length} récords personales en el último mes. ¡Sigue así!`,
      priority: 'low',
      basedOn: { recentRecordsCount: recentRecords.length },
      confidence: 1,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
  } else if (data.recentWorkouts.length >= 12 && recentRecords.length === 0) {
    recommendations.push({
      type: 'progress',
      title: 'Rompe un récord personal',
      description: 'No has establecido récords recientemente. Intenta superar tu mejor marca en tu próximo entrenamiento.',
      priority: 'medium',
      basedOn: { recentRecordsCount: 0, workoutCount: data.recentWorkouts.length },
      confidence: 0.75,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    })
  }

  return recommendations
}