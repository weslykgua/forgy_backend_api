import prisma from '../config/database'
import { exercisesDB } from '../data/exercisesData'

// Translate muscle groups to app standard (Spanish)
function mapMuscleGroup(rawMuscle: string): string {
  if (!rawMuscle) return 'Cardio'
  const muscleLower = rawMuscle.toLowerCase()
  if (muscleLower.includes('chest') || muscleLower.includes('pecho') || muscleLower.includes('pectoral')) return 'Pecho'
  if (muscleLower.includes('back') || muscleLower.includes('espalda') || muscleLower.includes('lats') || muscleLower.includes('traps')) return 'Espalda'
  if (muscleLower.includes('leg') || muscleLower.includes('pierna') || muscleLower.includes('quad') || muscleLower.includes('hamstring') || muscleLower.includes('calf') || muscleLower.includes('glute') || muscleLower.includes('calves')) return 'Piernas'
  if (muscleLower.includes('shoulder') || muscleLower.includes('hombro') || muscleLower.includes('deltoid') || muscleLower.includes('neck')) return 'Hombros'
  if (muscleLower.includes('arm') || muscleLower.includes('brazo') || muscleLower.includes('bicep') || muscleLower.includes('tricep') || muscleLower.includes('forearm')) return 'Brazos'
  if (muscleLower.includes('waist') || muscleLower.includes('abdomen') || muscleLower.includes('abs') || muscleLower.includes('core') || muscleLower.includes('abdominals')) return 'Abdomen'
  return 'Cardio'
}

function mapDifficulty(raw: string): string {
  if (!raw) return 'Principiante'
  const val = raw.toLowerCase()
  if (val.includes('beginner') || val.includes('principiante')) return 'Principiante'
  if (val.includes('intermediate') || val.includes('intermedio')) return 'Intermedio'
  if (val.includes('advanced') || val.includes('avanzado')) return 'Avanzado'
  return 'Principiante'
}

export async function seedExercisesIfNeeded(force = false) {
  try {
    const count = await prisma.exercise.count()
    if (count > 0 && !force) {
      console.log(`ℹ️ Base de datos ya contiene ${count} ejercicios. Omitiendo seeder.`)
      return
    }

    console.log('🌱 Iniciando seeding de ejercicios...')
    
    if (force) {
      console.log('🧹 Borrando ejercicios existentes...')
      await prisma.workoutLog.deleteMany({})
      await prisma.routineExercise.deleteMany({})
      await prisma.personalRecord.deleteMany({})
      await prisma.exercise.deleteMany({})
    }

    const allExercisesToInsert: any[] = []

    // 1. Insert local exercises (Spanish, exercisesData.ts)
    console.log('Inserting local exercises from exercisesData.ts...')
    for (const ex of exercisesDB) {
      allExercisesToInsert.push({
        id: ex.id,
        name: ex.name,
        muscle: ex.muscle,
        video: ex.video || null,
        description: ex.description || null,
        difficulty: ex.difficulty || 'Principiante',
        equipment: ex.equipment || 'Ninguno',
        instructions: ex.instructions || [],
        category: 'strength',
        gifUrl: null
      })
    }

    console.log(`Inserting ${allExercisesToInsert.length} exercises in database...`)
    
    // Chunk database insert to avoid parameter limits in PostgreSQL
    const chunkSize = 100
    let inserted = 0
    for (let i = 0; i < allExercisesToInsert.length; i += chunkSize) {
      const chunk = allExercisesToInsert.slice(i, i + chunkSize)
      const res = await prisma.exercise.createMany({
        data: chunk,
        skipDuplicates: true
      })
      inserted += res.count
    }

    console.log(`✅ Seeding de ejercicios completado. ${inserted} ejercicios insertados en total.`)
  } catch (error: any) {
    console.error('❌ Error during exercise seeding:', error)
  }
}
