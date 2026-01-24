export interface Exercise {
  id: string
  name: string
  muscle: string
  video: string
  description: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  equipment: string
  instructions: string[]
  createdAt: string
}
