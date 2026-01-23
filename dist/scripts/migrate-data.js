"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const exercisesData_1 = require("../data/exercisesData");
const workoutsData_1 = require("../data/workoutsData");
const progressData_1 = require("../data/progressData");
exports.prisma = new client_1.PrismaClient();
async function migrateData() {
    console.log('🚀 Iniciando migración de datos...\n');
    try {
        // 1. Limpiar datos existentes (opcional)
        console.log('🧹 Limpiando datos existentes...');
        await exports.prisma.workoutLog.deleteMany({});
        await exports.prisma.dailyProgress.deleteMany({});
        await exports.prisma.exercise.deleteMany({});
        console.log('✅ Datos anteriores eliminados\n');
        // 2. Migrar Ejercicios
        console.log('💪 Migrando ejercicios...');
        const exercisesCreated = await Promise.all(exercisesData_1.exercisesDB.map((exercise) => exports.prisma.exercise.create({
            data: {
                id: exercise.id,
                name: exercise.name,
                muscle: exercise.muscle,
                video: exercise.video || null,
                description: exercise.description || null,
                difficulty: exercise.difficulty || null,
                equipment: exercise.equipment || null,
                instructions: exercise.instructions || [],
                createdAt: new Date(exercise.createdAt),
            },
        })));
        console.log(`✅ ${exercisesCreated.length} ejercicios migrados\n`);
        // 3. Migrar Workout Logs
        console.log('🏋️ Migrando registros de entrenamientos...');
        const workoutLogsCreated = await Promise.all(workoutsData_1.workoutLogsDB.map((log) => exports.prisma.workoutLog.create({
            data: {
                id: log.id,
                date: log.date,
                exerciseId: log.exerciseId,
                exerciseName: log.exerciseName,
                sets: log.sets,
                duration: log.duration || null,
                notes: log.notes || null,
                createdAt: new Date(log.createdAt),
            },
        })));
        console.log(`✅ ${workoutLogsCreated.length} registros de entrenamiento migrados\n`);
        // 4. Migrar Daily Progress
        console.log('📊 Migrando progreso diario...');
        const dailyProgressCreated = await Promise.all(progressData_1.dailyProgressDB.map((progress) => exports.prisma.dailyProgress.create({
            data: {
                id: progress.id,
                date: progress.date,
                weight: progress.weight || null,
                waterIntake: progress.waterIntake || null,
                caloriesConsumed: progress.caloriesConsumed || null,
                caloriesBurned: progress.caloriesBurned || null,
                sleepHours: progress.sleepHours || null,
                mood: progress.mood || null,
                notes: progress.notes || null,
                createdAt: new Date(progress.createdAt),
            },
        })));
        console.log(`✅ ${dailyProgressCreated.length} registros de progreso diario migrados\n`);
        // 5. Verificar datos migrados
        console.log('🔍 Verificando migración...');
        const exercisesCount = await exports.prisma.exercise.count();
        const workoutLogsCount = await exports.prisma.workoutLog.count();
        const dailyProgressCount = await exports.prisma.dailyProgress.count();
        console.log(`
📈 Resumen de la migración:
   - Ejercicios: ${exercisesCount}
   - Registros de entrenamiento: ${workoutLogsCount}
   - Registros de progreso diario: ${dailyProgressCount}
    `);
        console.log('✅ ¡Migración completada exitosamente!');
    }
    catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    }
    finally {
        await exports.prisma.$disconnect();
    }
}
// Ejecutar migración
migrateData().catch((error) => {
    console.error(error);
    process.exit(1);
});
