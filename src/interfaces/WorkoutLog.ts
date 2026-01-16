export interface WorkoutLog {
    id: string;
    date: string; // YYYY-MM-DD
    exerciseId: string;
    exerciseName: string;
    sets: { reps: number; weight: number; completed: boolean }[];
    duration: number; // minutos
    notes: string;
    createdAt: string;
}
