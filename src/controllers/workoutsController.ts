import { Request, Response } from 'express'
import { WorkoutLog } from '../interfaces/WorkoutLog'
import { workoutLogsDB } from '../data/workoutsData'
import { dailyProgressDB } from '../data/progressData'

export function getWorkouts(req: Request, res: Response) {
  const { date, startDate, endDate } = req.query
  let filtered = [...workoutLogsDB]

  if (date) {
    filtered = filtered.filter((w) => w.date === date)
  }
  if (startDate && endDate) {
    filtered = filtered.filter((w) => w.date >= startDate && w.date <= endDate)
  }
  res.json(filtered)
}

export function getWorkoutById(req: Request, res: Response) {
  const workout = workoutLogsDB.find((w) => w.id === req.params.id)
  if (!workout) return res.status(404).json({ error: 'Entrenamiento no encontrado' })
  res.json(workout)
}

export function getWorkoutHistory(req: Request, res: Response) {
  const grouped: {
    [date: string]: { workouts: WorkoutLog[]; totalVolume: number; totalDuration: number }
  } = {}

  workoutLogsDB.forEach((workout) => {
    if (!grouped[workout.date]) {
      grouped[workout.date] = { workouts: [], totalVolume: 0, totalDuration: 0 }
    }
    grouped[workout.date].workouts.push(workout)
    grouped[workout.date].totalVolume += workout.sets.reduce((acc, s) => acc + s.reps * s.weight, 0)
    grouped[workout.date].totalDuration += workout.duration
  })

  const history = Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 30)
    .map(([date, data]) => ({
      date,
      exerciseCount: data.workouts.length,
      totalVolume: Math.round(data.totalVolume),
      totalDuration: data.totalDuration,
      workouts: data.workouts,
    }))

  res.json(history)
}

export function getPersonalRecords(req: Request, res: Response) {
  const prs: {
    [exerciseId: string]: {
      exerciseName: string
      maxWeight: number
      maxVolume: number
      date: string
    }
  } = {}

  workoutLogsDB.forEach((workout) => {
    const maxSetWeight = Math.max(...workout.sets.map((s) => s.weight))
    const workoutVolume = workout.sets.reduce((acc, s) => acc + s.reps * s.weight, 0)

    if (!prs[workout.exerciseId] || maxSetWeight > prs[workout.exerciseId].maxWeight) {
      prs[workout.exerciseId] = {
        exerciseName: workout.exerciseName,
        maxWeight: maxSetWeight,
        maxVolume: workoutVolume,
        date: workout.date,
      }
    }
  })

  res.json(Object.values(prs).sort((a, b) => b.maxWeight - a.maxWeight))
}

export function getWorkoutCalendar(req: Request, res: Response) {
  const workoutDates = workoutLogsDB.map((w) => w.date)
  const progressDates = dailyProgressDB.map((p) => p.date)

  const calendar: { [date: string]: { hasWorkout: boolean; hasProgress: boolean } } = {}

  workoutDates.forEach((d) => {
    if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false }
    calendar[d].hasWorkout = true
  })

  progressDates.forEach((d) => {
    if (!calendar[d]) calendar[d] = { hasWorkout: false, hasProgress: false }
    calendar[d].hasProgress = true
  })

  res.json(calendar)
}

export function createWorkout(req: Request, res: Response) {
  const newWorkout: WorkoutLog = {
    id: Date.now().toString(),
    date: req.body.date || new Date().toISOString().split('T')[0],
    exerciseId: req.body.exerciseId,
    exerciseName: req.body.exerciseName,
    sets: req.body.sets || [],
    duration: req.body.duration || 0,
    notes: req.body.notes || '',
    createdAt: new Date().toISOString(),
  }
  workoutLogsDB.push(newWorkout)
  res.status(201).json(newWorkout)
}

export function updateWorkout(req: Request, res: Response) {
  const index = workoutLogsDB.findIndex((w) => w.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' })

  workoutLogsDB[index] = { ...workoutLogsDB[index], ...req.body }
  res.json(workoutLogsDB[index])
}

export function deleteWorkout(req: Request, res: Response) {
  const index = workoutLogsDB.findIndex((w) => w.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Entrenamiento no encontrado' })

  const deleted = workoutLogsDB.splice(index, 1)[0]
  res.json({ message: 'Entrenamiento eliminado', workout: deleted })
}
