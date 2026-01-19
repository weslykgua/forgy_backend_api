import { PrismaClient } from '@prisma/client';
import { exercisesDB } from './src/data/exercisesData'
import { workoutLogsDB } from './src/data/workoutsData';
import { dailyProgressDB } from './src/data/progressData';
const prisma = new PrismaClient();

async function migrateData() {
  console.log('🚀 Iniciando migración de datos...\n');

  try {
    // 1. Limpiar datos existentes (opcional, comentar si no quieres limpiar)
    console.log('🧹 Limpiando datos existentes...');
    await prisma.workoutLog.deleteMany({});
    await prisma.dailyProgress.deleteMany({});
    await prisma.exercise.deleteMany({});
    console.log('✅ Datos anteriores eliminados\n');

    // 2. Migrar Ejercicios
    console.log('💪 Migrando ejercicios...');
    const exercisesCreated = await Promise.all(
      exercisesDB.map((exercise) =>
        prisma.exercise.create({
          data: {
            id: exercise.id,
            name: exercise.name,
            muscle: exercise.muscle,
            video: exercise.video,
            description: exercise.description,
            difficulty: exercise.difficulty,
            equipment: exercise.equipment,
            instructions: exercise.instructions,
            createdAt: new Date(exercise.createdAt),
          },
        })
      )
    );
    console.log(`✅ ${exercisesCreated.length} ejercicios migrados\n`);

    // 3. Migrar Workout Logs
    console.log('🏋️ Migrando registros de entrenamientos...');
    const workoutLogsCreated = await Promise.all(
      workoutLogsDB.map((log) =>
        prisma.workoutLog.create({
          data: {
            id: log.id,
            date: log.date,
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            sets: log.sets,
            duration: log.duration,
            notes: log.notes,
            createdAt: new Date(log.createdAt),
          },
        })
      )
    );
    console.log(`✅ ${workoutLogsCreated.length} registros de entrenamiento migrados\n`);

    // 4. Migrar Daily Progress
    console.log('📊 Migrando progreso diario...');
    const dailyProgressCreated = await Promise.all(
      dailyProgressDB.map((progress) =>
        prisma.dailyProgress.create({
          data: {
            id: progress.id,
            date: progress.date,
            weight: progress.weight,
            waterIntake: progress.waterIntake,
            caloriesConsumed: progress.caloriesConsumed,
            caloriesBurned: progress.caloriesBurned,
            sleepHours: progress.sleepHours,
            mood: progress.mood,
            notes: progress.notes,
            createdAt: new Date(progress.createdAt),
          },
        })
      )
    );
    console.log(`✅ ${dailyProgressCreated.length} registros de progreso diario migrados\n`);

    // 5. Verificar datos migrados
    console.log('🔍 Verificando migración...');
    const exercisesCount = await prisma.exercise.count();
    const workoutLogsCount = await prisma.workoutLog.count();
    const dailyProgressCount = await prisma.dailyProgress.count();

    console.log(`
📈 Resumen de la migración:
   - Ejercicios: ${exercisesCount}
   - Registros de entrenamiento: ${workoutLogsCount}
   - Registros de progreso diario: ${dailyProgressCount}
    `);

    console.log('✅ ¡Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
migrateData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });