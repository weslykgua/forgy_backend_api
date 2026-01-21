"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutLogsDB = void 0;
exports.workoutLogsDB = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        exerciseId: '1',
        exerciseName: 'Press Banca',
        sets: [
            { reps: 12, weight: 60, completed: true },
            { reps: 10, weight: 70, completed: true },
            { reps: 8, weight: 80, completed: true },
        ],
        duration: 15,
        notes: 'Buen entrenamiento',
        createdAt: new Date().toISOString(),
    },
];
