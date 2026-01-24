import { PrismaClient } from '@prisma/client'
import { exercisesDB } from '../data/exercisesData'
import { workoutLogsDB } from '../data/workoutsData'
import { dailyProgressDB } from '../data/progressData'

const prisma = new PrismaClient()

// Definimos explícitamente el tipo de retorno
const groupLogsByDate = (logs: any[]): Record<string, any[]> => {
  return logs.reduce((acc, log) => {
    const dateStr = log.date.split('T')[0] // Asegurar formato YYYY-MM-DD
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(log)
    return acc
  }, {} as Record<string, any[]>)
}

async function migrateData() {
  console.log('🚀 Iniciando migración de datos a la nueva estructura...\n')

  try {
    // 1. LIMPIEZA
    console.log('🧹 Limpiando base de datos...')
    await prisma.workoutLog.deleteMany({})
    await prisma.routineExercise.deleteMany({})
    await prisma.personalRecord.deleteMany({})
    
    await prisma.trainingSession.deleteMany({})
    await prisma.routine.deleteMany({})
    await prisma.dailyProgress.deleteMany({})
    await prisma.goal.deleteMany({})
    await prisma.bodyMeasurement.deleteMany({})
    
    await prisma.exercise.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('✅ Base de datos limpia.\n')

    // 2. CREAR USUARIO
    console.log('👤 Creando usuario por defecto para la migración...')
    const defaultUser = await prisma.user.create({
      data: {
        email: 'usuario@migracion.com',
        password: 'password123',
        name: 'Usuario Migrado',
        activityLevel: 'moderate',
        fitnessGoal: 'maintain'
      }
    })
    console.log(`✅ Usuario creado con ID: ${defaultUser.id}\n`)

    // 3. MIGRAR EJERCICIOS
    console.log('💪 Migrando ejercicios...')
    const exercisesResult = await prisma.exercise.createMany({
      data: exercisesDB.map((ex) => ({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        video: ex.video || null,
        description: ex.description || null,
        difficulty: ex.difficulty || 'beginner',
        equipment: ex.equipment || 'bodyweight',
        instructions: ex.instructions || [],
        category: 'strength'
      })),
      skipDuplicates: true
    })
    console.log(`✅ ${exercisesResult.count} ejercicios insertados.\n`)

    // 4. MIGRAR WORKOUTS
    console.log('🏋️ Transformando y migrando entrenamientos...')
    
    const groupedWorkouts = groupLogsByDate(workoutLogsDB)
    let sessionsCount = 0
    let logsCount = 0

    // CORRECCIÓN PRINCIPAL AQUI:
    for (const [dateStr, logsUnknown] of Object.entries(groupedWorkouts)) {
      // Forzamos a TypeScript a entender que esto es un array
      const logs = logsUnknown as any[] 

      const sessionDate = new Date(dateStr)
      
      // Tipamos explícitamente 'acc' y 'log'
      const totalVolume = logs.reduce((acc: number, log: any) => {
        const sets = log.sets as any[]
        const logVol = sets.reduce((sAcc: number, s: any) => sAcc + (Number(s.weight) * Number(s.reps)), 0)
        return acc + logVol
      }, 0)

      const totalDuration = logs.reduce((acc: number, l: any) => acc + (l.duration || 0), 0) || 60

      await prisma.trainingSession.create({
        data: {
          userId: defaultUser.id,
          date: sessionDate,
          duration: totalDuration,
          totalVolume: totalVolume,
          notes: 'Sesión migrada automáticamente',
          
          workoutLogs: {
            create: logs.map((log: any) => ({
              exerciseId: log.exerciseId,
              sets: log.sets, 
              duration: log.duration || 0,
              notes: log.notes || null,
              completed: true
            }))
          }
        }
      })
      
      sessionsCount++
      logsCount += logs.length
    }
    console.log(`✅ ${sessionsCount} sesiones creadas conteniendo ${logsCount} logs de ejercicio.\n`)

    // 5. MIGRAR DAILY PROGRESS
    console.log('📊 Migrando progreso diario...')
    const progressResult = await prisma.dailyProgress.createMany({
      data: dailyProgressDB.map((p) => ({
        userId: defaultUser.id,
        date: new Date(p.date),
        weight: p.weight || null,
        waterIntake: p.waterIntake || null,
        caloriesConsumed: p.caloriesConsumed || null,
        caloriesBurned: p.caloriesBurned || null,
        sleepHours: p.sleepHours || null,
        mood: p.mood || null,
        notes: p.notes || null
      })),
      skipDuplicates: true 
    })
    console.log(`✅ ${progressResult.count} registros de progreso migrados.\n`)

    // 6. VERIFICACIÓN
    console.log('🏁 Verificación final:')
    const counts = {
      users: await prisma.user.count(),
      exercises: await prisma.exercise.count(),
      sessions: await prisma.trainingSession.count(),
      logs: await prisma.workoutLog.count(),
      progress: await prisma.dailyProgress.count()
    }
    console.table(counts)

  } catch (error) {
    console.error('❌ Error fatal durante la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()