import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Actualiza la racha de entrenamiento del usuario
 */
export async function updateWorkoutStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = await prisma.workoutStreak.findUnique({
    where: { userId }
  })

  if (!streak) {
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
  if (lastWorkout) {
    lastWorkout.setHours(0, 0, 0, 0)
  }

  if (!lastWorkout) {
    // Primera vez
    await prisma.workoutStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutDate: today
      }
    })
  } else {
    const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Mismo día, no cambiar
      return streak
    } else if (diffDays === 1) {
      // Día consecutivo
      const newStreak = streak.currentStreak + 1
      await prisma.workoutStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastWorkoutDate: today
        }
      })
    } else {
      // Racha rota
      await prisma.workoutStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastWorkoutDate: today
        }
      })
    }
  }
}