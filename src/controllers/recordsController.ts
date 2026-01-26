import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Verifica y actualiza los récords personales del usuario
 */
export async function checkAndUpdateRecords(userId: string, workouts: any[]) {
  for (const workout of workouts) {
    const { exerciseId, sets } = workout

    // Calcular máximo peso levantado
    let maxWeight = 0
    let maxWeightReps = 0
    let maxReps = 0
    let maxRepsWeight = 0
    let totalVolume = 0

    sets.forEach((set: any) => {
      if (set.completed) {
        const weight = set.weight || 0
        const reps = set.reps || 0

        if (weight > maxWeight) {
          maxWeight = weight
          maxWeightReps = reps
        }

        if (reps > maxReps) {
          maxReps = reps
          maxRepsWeight = weight
        }

        totalVolume += weight * reps
      }
    })

    // Verificar y actualizar récord de peso máximo
    if (maxWeight > 0) {
      const existingRecord = await prisma.personalRecord.findFirst({
        where: {
          userId,
          exerciseId,
          recordType: 'max_weight'
        },
        orderBy: { value: 'desc' }
      })

      if (!existingRecord || maxWeight > existingRecord.value) {
        await prisma.personalRecord.create({
          data: {
            userId,
            exerciseId,
            recordType: 'max_weight',
            value: maxWeight,
            reps: maxWeightReps,
            date: new Date()
          }
        })
      }
    }

    // Verificar récord de repeticiones
    if (maxReps > 0) {
      const existingRecord = await prisma.personalRecord.findFirst({
        where: {
          userId,
          exerciseId,
          recordType: 'max_reps'
        },
        orderBy: { value: 'desc' }
      })

      if (!existingRecord || maxReps > existingRecord.value) {
        await prisma.personalRecord.create({
          data: {
            userId,
            exerciseId,
            recordType: 'max_reps',
            value: maxReps,
            weight: maxRepsWeight,
            date: new Date()
          }
        })
      }
    }

    // Verificar récord de volumen
    if (totalVolume > 0) {
      const existingRecord = await prisma.personalRecord.findFirst({
        where: {
          userId,
          exerciseId,
          recordType: 'max_volume'
        },
        orderBy: { value: 'desc' }
      })

      if (!existingRecord || totalVolume > existingRecord.value) {
        await prisma.personalRecord.create({
          data: {
            userId,
            exerciseId,
            recordType: 'max_volume',
            value: totalVolume,
            date: new Date()
          }
        })
      }
    }
  }
}