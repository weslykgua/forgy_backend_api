"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgress = getProgress;
exports.getProgressByDate = getProgressByDate;
exports.getProgressStats = getProgressStats;
exports.createProgress = createProgress;
exports.deleteProgress = deleteProgress;
const progressData_1 = require("../data/progressData");
const workoutsData_1 = require("../data/workoutsData");
function getProgress(req, res) {
    const { date, startDate, endDate } = req.query;
    let filtered = [...progressData_1.dailyProgressDB];
    if (date) {
        filtered = filtered.filter((p) => p.date === date);
    }
    if (startDate && endDate) {
        filtered = filtered.filter((p) => p.date >= startDate && p.date <= endDate);
    }
    res.json(filtered);
}
function getProgressByDate(req, res) {
    const progress = progressData_1.dailyProgressDB.find((p) => p.date === req.params.date);
    if (!progress)
        return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(progress);
}
function getProgressStats(req, res) {
    const totalWorkouts = workoutsData_1.workoutLogsDB.length;
    const totalVolume = workoutsData_1.workoutLogsDB.reduce((acc, log) => {
        return acc + log.sets.reduce((setAcc, set) => setAcc + set.reps * set.weight, 0);
    }, 0);
    const avgWater = progressData_1.dailyProgressDB.length > 0
        ? progressData_1.dailyProgressDB.reduce((acc, p) => acc + p.waterIntake, 0) / progressData_1.dailyProgressDB.length
        : 0;
    const weightHistory = progressData_1.dailyProgressDB
        .filter((p) => p.weight && p.weight > 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((p) => ({ date: p.date, weight: p.weight }));
    const today = new Date();
    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasActivity = workoutsData_1.workoutLogsDB.some((w) => w.date === dateStr) ||
            progressData_1.dailyProgressDB.some((p) => p.date === dateStr);
        if (hasActivity) {
            streakDays++;
        }
        else if (i > 0) {
            break;
        }
    }
    res.json({
        totalWorkouts,
        totalVolume: Math.round(totalVolume),
        avgWater: Math.round(avgWater),
        weightHistory,
        currentWeight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0,
        streakDays,
    });
}
function createProgress(req, res) {
    const existingIndex = progressData_1.dailyProgressDB.findIndex((p) => p.date === req.body.date);
    if (existingIndex !== -1) {
        progressData_1.dailyProgressDB[existingIndex] = { ...progressData_1.dailyProgressDB[existingIndex], ...req.body };
        return res.json(progressData_1.dailyProgressDB[existingIndex]);
    }
    const newProgress = {
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
    };
    progressData_1.dailyProgressDB.push(newProgress);
    res.status(201).json(newProgress);
}
function deleteProgress(req, res) {
    const index = progressData_1.dailyProgressDB.findIndex((p) => p.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Registro no encontrado' });
    const deleted = progressData_1.dailyProgressDB.splice(index, 1)[0];
    res.json({ message: 'Registro eliminado', progress: deleted });
}
