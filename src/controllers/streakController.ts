import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Actualiza la racha de entrenamiento del usuario
 */
export async function updateWorkoutStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = await prisma.workoutStreak.findUnique({ where: { userId } })

  if (!streak) {
    // Si no existe la racha, crearla desde 1
    streak = await prisma.workoutStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: today
      }
    })
    return streak
  }

  const lastWorkout = streak.lastWorkoutDate ? new Date(streak.lastWorkoutDate) : null
  if (lastWorkout) lastWorkout.setHours(0, 0, 0, 0)

  let updatedStreak = { ...streak }

  if (!lastWorkout) {
    // Nunca hizo un entrenamiento antes
    updatedStreak.currentStreak = 1
    updatedStreak.longestStreak = Math.max(1, streak.longestStreak)
  } else {
    const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      // Ya hizo ejercicio hoy, no cambiar nada
      return streak
    } else if (diffDays === 1) {
      // Día consecutivo, sumar racha
      updatedStreak.currentStreak += 1
      updatedStreak.longestStreak = Math.max(updatedStreak.currentStreak, streak.longestStreak)
    } else {
      // Racha rota
      updatedStreak.currentStreak = 1
    }
  }

  // Actualizar la fecha del último entrenamiento
  updatedStreak.lastWorkoutDate = today

  const savedStreak = await prisma.workoutStreak.update({
    where: { userId },
    data: {
      currentStreak: updatedStreak.currentStreak,
      longestStreak: updatedStreak.longestStreak,
      lastWorkoutDate: updatedStreak.lastWorkoutDate
    }
  })

  return savedStreak
}

/**
 * Obtiene la racha de entrenamiento de un usuario
 */
export async function getWorkoutStreak(userId: string) {
  const streak = await prisma.workoutStreak.findUnique({
    where: { userId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastWorkoutDate: true,
    }
  })

  if (!streak) {
    return { currentStreak: 0, longestStreak: 0, lastWorkoutDate: null }
  }

  return streak
}
