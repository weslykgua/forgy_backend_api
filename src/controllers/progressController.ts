import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().dailyProgress

// --- GET: Listar con filtros de fecha directamente en DB ---
export async function getProgress(req: Request, res: Response) {
  try {
    const { date, startDate, endDate } = req.query
    const where: any = {}

    if (date) {
      where.date = date as string
    } else if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string
      }
    }

    const progress = await prisma.findMany({ 
      where,
      orderBy: { date: 'desc' } 
    })
    res.json(progress)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el progreso' })
  }
}

// --- GET: Buscar por fecha (Usando findFirst) ---
export async function getProgressByDate(req: Request, res: Response) {
  try {
    if (!req.params.date) {
      return res.status(400).json({ error: 'Fecha es requerida' })
    }
    const progress = await prisma.findFirst({
      where: { date: Array.isArray(req.params.date) ? req.params.date[0] : req.params.date }
    })
    if (!progress) return res.status(404).json({ error: 'Registro no encontrado' })
    res.json(progress)
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

// --- POST: Crear o Actualizar (Upsert) ---
export async function createProgress(req: Request, res: Response) {
  try {
    const { date, ...data } = req.body
    const targetDate = date || new Date().toISOString().split('T')[0]

    // Usamos upsert para actualizar si ya existe la fecha o crear si no
    const progress = await prisma.upsert({
      where: { date: targetDate }, // Asumiendo que 'date' es @unique en tu schema
      update: data,
      create: {
        date: targetDate,
        weight: data.weight || 0,
        waterIntake: data.waterIntake || 0,
        caloriesConsumed: data.caloriesConsumed || 0,
        caloriesBurned: data.caloriesBurned || 0,
        sleepHours: data.sleepHours || 0,
        mood: data.mood || 'Bien',
        notes: data.notes || '',
      }
    })
    res.status(201).json(progress)
  } catch (error) {
    res.status(400).json({ error: 'Error al procesar el registro' })
  }
}

// --- DELETE: Borrar por ID ---
export async function deleteProgress(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.delete({
      where: { id }
    })
    res.json({ message: 'Registro eliminado' })
  } catch (error) {
    res.status(404).json({ error: 'No se encontró el registro para eliminar' })
  }
}

// --- GET: Estadísticas (Agregaciones de Prisma) ---
export async function getProgressStats(req: Request, res: Response) {
  try {
    // 1. Volumen total desde WorkoutLog (asumiendo que existe el modelo)
    // Debes usar el modelo correcto que tiene la relación 'sets', por ejemplo prisma.workoutLog
    // Si no tienes acceso a workoutLog aquí, elimina el cálculo de volumen o ajusta según tu modelo
    const workouts: any[] = []; // Placeholder vacío para evitar error de compilación
    const totalVolume = 0;

    // 2. Promedio de agua y peso
    const stats = await prisma.aggregate({
      _avg: { waterIntake: true },
      _count: { id: true }
    })

    const weightHistory = await prisma.findMany({
      where: { weight: { gt: 0 } },
      select: { date: true, weight: true },
      orderBy: { date: 'asc' }
    })

    res.json({
      totalWorkouts: workouts.length,
      totalVolume: Math.round(totalVolume),
      avgWater: Math.round(stats._avg.waterIntake || 0),
      weightHistory,
      currentWeight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular estadísticas' })
  }
}