"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkouts = getWorkouts;
exports.getWorkoutById = getWorkoutById;
exports.getWorkoutHistory = getWorkoutHistory;
exports.getPersonalRecords = getPersonalRecords;
exports.getWorkoutCalendar = getWorkoutCalendar;
exports.createWorkout = createWorkout;
exports.updateWorkout = updateWorkout;
exports.deleteWorkout = deleteWorkout;
const workoutsData_1 = require("../data/workoutsData");
const progressData_1 = require("../data/progressData");
function getWorkouts(req, res) {
    const { date, startDate, endDate } = req.query;
    let filtered = [...workoutsData_1.workoutLogsDB];
    if (date) {
        filtered = filtered.filter((w) => w.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter((w) => w.date >= startDate && w.date <= endDate);
    }
    res.json(filtered);
}
function getWorkoutById(req, res) {
    const workout = workoutsData_1.workoutLogsDB.find((w) => w.id === req.params.id);
    if (!workout)
        return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    res.json(workout);
}
function getWorkoutHistory(req, res) {
    const grouped = {};
    workoutsData_1.workoutLogsDB.forEach((workout) => {
        if (!grouped[workout.date]) {
            grouped[workout.date] = { workouts: [], totalVolume: 0, totalDuration: 0 };
        }
        grouped[workout.date].workouts.push(workout);
        grouped[workout.date].totalVolume += workout.sets.reduce((acc, s) => acc + s.reps * s.weight, 0);
        grouped[workout.date].totalDuration += workout.duration;
    });
    const history = Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 30)
        .map(([date, data]) => ({
        date,
        exerciseCount: data.workouts.length,
        totalVolume: Math.round(data.totalVolume),
        totalDuration: data.totalDuration,
        workouts: data.workouts,
    }));
    res.json(history);
}
function getPersonalRecords(req, res) {
    const prs = {};
    workoutsData_1.workoutLogsDB.forEach((workout) => {
        const maxSetWeight = Math.max(...workout.sets.map((s) => s.weight));
        const workoutVolume = workout.sets.reduce((acc, s) => acc + s.reps * s.weight, 0);
        if (!prs[workout.exerciseId] || maxSetWeight > prs[workout.exerciseId].maxWeight) {
            prs[workout.exerciseId] = {
                exerciseName: workout.exerciseName,
                maxWeight: maxSetWeight,
                maxVolume: workoutVolume,
                date: workout.date,
            };
        }
    });
    res.json(Object.values(prs).sort((a, b) => b.maxWeight - a.maxWeight));
}
function getWorkoutCalendar(req, res) {
    const workoutDates = workoutsData_1.workoutLogsDB.map((w) => w.date);
    const progressDates = progressData_1.dailyProgressDB.map((p) => p.date);
    const calendar = {};
    workoutDates.forEach((d) => {
        if (!calendar[d])
            calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasWorkout = true;
    });
    progressDates.forEach((d) => {
        if (!calendar[d])
            calendar[d] = { hasWorkout: false, hasProgress: false };
        calendar[d].hasProgress = true;
    });
    res.json(calendar);
}
function createWorkout(req, res) {
    const newWorkout = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        exerciseId: req.body.exerciseId,
        exerciseName: req.body.exerciseName,
        sets: req.body.sets || [],
        duration: req.body.duration || 0,
        notes: req.body.notes || '',
        createdAt: new Date().toISOString(),
    };
    workoutsData_1.workoutLogsDB.push(newWorkout);
    res.status(201).json(newWorkout);
}
function updateWorkout(req, res) {
    const index = workoutsData_1.workoutLogsDB.findIndex((w) => w.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    workoutsData_1.workoutLogsDB[index] = { ...workoutsData_1.workoutLogsDB[index], ...req.body };
    res.json(workoutsData_1.workoutLogsDB[index]);
}
function deleteWorkout(req, res) {
    const index = workoutsData_1.workoutLogsDB.findIndex((w) => w.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    const deleted = workoutsData_1.workoutLogsDB.splice(index, 1)[0];
    res.json({ message: 'Entrenamiento eliminado', workout: deleted });
}
