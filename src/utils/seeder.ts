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
        name: ex.name,
        muscle: mapMuscleGroup(ex.muscle),
        video: ex.video || null,
        description: ex.description || null,
        difficulty: mapDifficulty(ex.difficulty || 'intermediate'),
        equipment: ex.equipment || 'bodyweight',
        instructions: ex.instructions || [],
        category: 'strength',
        gifUrl: null
      })
    }

    // 2. Fetch hasaneyldrm/exercises-dataset (1324 exercises)
    try {
      console.log('Fetching hasaneyldrm/exercises-dataset (1324 exercises)...')
      const res = await fetch('https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json')
      if (res.ok) {
        const hasanExercises = await res.json() as any[]
        console.log(`Fetched ${hasanExercises.length} exercises from hasaneyldrm/exercises-dataset`)
        for (const ex of hasanExercises) {
          let steps: string[] = []
          if (ex.instruction_steps && Array.isArray(ex.instruction_steps.en)) {
            steps = ex.instruction_steps.en
          } else if (typeof ex.instructions === 'string') {
            steps = [ex.instructions]
          } else if (ex.instructions && typeof ex.instructions.en === 'string') {
            steps = [ex.instructions.en]
          }

          allExercisesToInsert.push({
            name: ex.name,
            muscle: mapMuscleGroup(ex.body_part || ex.target || ex.muscle_group || 'Cardio'),
            video: null,
            description: null,
            difficulty: 'Principiante',
            equipment: ex.equipment || 'bodyweight',
            instructions: steps,
            category: ex.category || 'strength',
            gifUrl: ex.gif_url ? `https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/${ex.gif_url}` : null
          })
        }
      }
    } catch (e: any) {
      console.error('Error fetching hasaneyldrm/exercises-dataset:', e.message)
    }

    // 3. Fetch yuhonas/free-exercise-db (873 exercises)
    try {
      console.log('Fetching yuhonas/free-exercise-db (873 exercises)...')
      const res = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')
      if (res.ok) {
        const yuhonasExercises = await res.json() as any[]
        console.log(`Fetched ${yuhonasExercises.length} exercises from yuhonas/free-exercise-db`)
        for (const ex of yuhonasExercises) {
          // Check if already exists by name
          const nameLower = ex.name.toLowerCase()
          const exists = allExercisesToInsert.some(existing => existing.name.toLowerCase() === nameLower)
          if (!exists) {
            allExercisesToInsert.push({
              name: ex.name,
              muscle: mapMuscleGroup(ex.primaryMuscles?.[0] || 'Cardio'),
              video: null,
              description: null,
              difficulty: mapDifficulty(ex.level || 'beginner'),
              equipment: ex.equipment || 'bodyweight',
              instructions: ex.instructions || [],
              category: ex.category || 'strength',
              gifUrl: (ex.images && ex.images.length > 0) ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}` : null
            })
          }
        }
      }
    } catch (e: any) {
      console.error('Error fetching yuhonas/free-exercise-db:', e.message)
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
