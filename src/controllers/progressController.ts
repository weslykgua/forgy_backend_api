import { Request, Response } from 'express'
import { DailyProgress } from '../interfaces/DailyProgress'
import { dailyProgressDB } from '../data/progressData'
import { workoutLogsDB } from '../data/workoutsData'

export function getProgress(req: Request, res: Response) {
  const { date, startDate, endDate } = req.query
  let filtered = [...dailyProgressDB]

  if (date) {
    filtered = filtered.filter((p) => p.date === date)
  }
  if (startDate && endDate) {
    filtered = filtered.filter((p) => p.date >= startDate && p.date <= endDate)
  }
  res.json(filtered)
}

export function getProgressByDate(req: Request, res: Response) {
  const progress = dailyProgressDB.find((p) => p.date === req.params.date)
  if (!progress) return res.status(404).json({ error: 'Registro no encontrado' })
  res.json(progress)
}

export function getProgressStats(req: Request, res: Response) {
  const totalWorkouts = workoutLogsDB.length
  const totalVolume = workoutLogsDB.reduce((acc, log) => {
    return acc + log.sets.reduce((setAcc, set) => setAcc + set.reps * set.weight, 0)
  }, 0)

  const avgWater =
    dailyProgressDB.length > 0
      ? dailyProgressDB.reduce((acc, p) => acc + p.waterIntake, 0) / dailyProgressDB.length
      : 0

  const weightHistory = dailyProgressDB
    .filter((p) => p.weight && p.weight > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((p) => ({ date: p.date, weight: p.weight }))

  const today = new Date()
  let streakDays = 0
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    const hasActivity =
      workoutLogsDB.some((w) => w.date === dateStr) ||
      dailyProgressDB.some((p) => p.date === dateStr)
    if (hasActivity) {
      streakDays++
    } else if (i > 0) {
      break
    }
  }

  res.json({
    totalWorkouts,
    totalVolume: Math.round(totalVolume),
    avgWater: Math.round(avgWater),
    weightHistory,
    currentWeight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0,
    streakDays,
  })
}

export function createProgress(req: Request, res: Response) {
  const existingIndex = dailyProgressDB.findIndex((p) => p.date === req.body.date)

  if (existingIndex !== -1) {
    dailyProgressDB[existingIndex] = { ...dailyProgressDB[existingIndex], ...req.body }
    return res.json(dailyProgressDB[existingIndex])
  }

  const newProgress: DailyProgress = {
    id: Date.now().toString(),
    date: req.body.date || new Date().toISOString().split('T')[0],
    weight: req.body.weight || 0,
    waterIntake: req.body.waterIntake || 0,
    caloriesConsumed: req.body.caloriesConsumed || 0,
    caloriesBurned: req.body.caloriesBurned || 0,
    sleepHours: req.body.sleepHours || 0,
    mood: req.body.mood || 'Bien',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString(),
  }
  dailyProgressDB.push(newProgress)
  res.status(201).json(newProgress)
}

export function deleteProgress(req: Request, res: Response) {
  const index = dailyProgressDB.findIndex((p) => p.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Registro no encontrado' })

  const deleted = dailyProgressDB.splice(index, 1)[0]
  res.json({ message: 'Registro eliminado', progress: deleted })
}
