import { Exercise } from '../interfaces/Exercise'
import { Request, Response } from 'express'
import { exercisesDB } from '../data/exercisesData'

export function getExercises(req: Request, res: Response) {
  const { muscle, difficulty, search } = req.query
  let filtered = [...exercisesDB]

  if (muscle && muscle !== 'Todos') {
    filtered = filtered.filter((ex) => ex.muscle === muscle)
  }
  if (difficulty && difficulty !== 'Todos') {
    filtered = filtered.filter((ex) => ex.difficulty === difficulty)
  }
  if (search) {
    const searchLower = (search as string).toLowerCase()
    filtered = filtered.filter(
      (ex) =>
        ex.name.toLowerCase().includes(searchLower) ||
        ex.description.toLowerCase().includes(searchLower)
    )
  }
  res.json(filtered)
}
export function getStatsRequest(req: Request, res: Response) {
  res.json(getStats())
}
export function getIdRequest(req: Request, res: Response) {
  const exercise = exercisesDB.find((ex) => ex.id === req.params.id)
  if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado' })
  res.json(exercise)
}

export function createExercise(req: Request, res: Response) {
  const newExercise: Exercise = {
    id: Date.now().toString(),
    name: req.body.name,
    muscle: req.body.muscle,
    video: req.body.video || '',
    description: req.body.description || '',
    difficulty: req.body.difficulty || 'Principiante',
    equipment: req.body.equipment || '',
    instructions: req.body.instructions || [],
    createdAt: new Date().toISOString(),
  }
  exercisesDB.push(newExercise)
  res.status(201).json(newExercise)
}

export function updateExercise(req: Request, res: Response) {
  const index = exercisesDB.findIndex((ex) => ex.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' })

  exercisesDB[index] = { ...exercisesDB[index], ...req.body }
  res.json(exercisesDB[index])
}

export function deleteExercise(req: Request, res: Response) {
  const index = exercisesDB.findIndex((ex) => ex.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' })

  const deleted = exercisesDB.splice(index, 1)[0]
  res.json({ message: 'Ejercicio eliminado', exercise: deleted })
}

function getStats() {
  const byMuscle: { [key: string]: number } = {}
  const byDifficulty: { [key: string]: number } = {}

  exercisesDB.forEach((ex) => {
    byMuscle[ex.muscle] = (byMuscle[ex.muscle] || 0) + 1
    byDifficulty[ex.difficulty] = (byDifficulty[ex.difficulty] || 0) + 1
  })

  return {
    totalExercises: exercisesDB.length,
    byMuscle,
    byDifficulty,
  }
}
