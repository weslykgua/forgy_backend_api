# Crear una rutina
POST /api/routines
{
  "name": "Día de Pecho",
  "userId": "user-uuid",
  "type": "workout",
  "difficulty": "intermediate"
}

# Agregar ejercicio a la rutina
POST /api/routines/{routineId}/exercises
{
  "exerciseId": "exercise-uuid",
  "order": 1,
  "targetSets": 4,
  "targetReps": 10,
  "targetWeight": 80,
  "restTime": 90
}

# Registrar un entrenamiento
POST /api/workouts
{
  "userId": "user-uuid",
  "routineId": "routine-uuid",
  "duration": 60,
  "rating": 4,
  "workouts": [
    {
      "exerciseId": "exercise-uuid",
      "sets": [
        { "reps": 10, "weight": 80, "completed": true },
        { "reps": 10, "weight": 80, "completed": true },
        { "reps": 8, "weight": 85, "completed": true }
      ]
    }
  ]
}

# Obtener métricas del dashboard
GET /api/dashboard/{userId}

# Generar recomendaciones de IA
POST /api/ai/recommendations/{userId}