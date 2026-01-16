export interface DailyProgress {
    id: string;
    date: string; // YYYY-MM-DD
    weight: number; // kg
    waterIntake: number; // ml
    caloriesConsumed: number;
    caloriesBurned: number;
    sleepHours: number;
    mood: 'Excelente' | 'Bien' | 'Regular' | 'Mal';
    notes: string;
    createdAt: string;
}
