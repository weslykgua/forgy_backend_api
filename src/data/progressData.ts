import { DailyProgress } from '../interfaces/DailyProgressInterface'

export const dailyProgressDB: DailyProgress[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    weight: 75,
    waterIntake: 2500,
    caloriesConsumed: 2200,
    caloriesBurned: 500,
    sleepHours: 7,
    mood: 'Bien',
    notes: 'Día productivo',
    createdAt: new Date().toISOString(),
  },
]
