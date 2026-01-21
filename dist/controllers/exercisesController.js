"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercises = getExercises;
exports.getStatsRequest = getStatsRequest;
exports.getIdRequest = getIdRequest;
exports.createExercise = createExercise;
exports.updateExercise = updateExercise;
exports.deleteExercise = deleteExercise;
const exercisesData_1 = require("../data/exercisesData");
function getExercises(req, res) {
    const { muscle, difficulty, search } = req.query;
    let filtered = [...exercisesData_1.exercisesDB];
    if (muscle && muscle !== 'Todos') {
        filtered = filtered.filter((ex) => ex.muscle === muscle);
    }
    if (difficulty && difficulty !== 'Todos') {
        filtered = filtered.filter((ex) => ex.difficulty === difficulty);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter((ex) => ex.name.toLowerCase().includes(searchLower) ||
            ex.description.toLowerCase().includes(searchLower));
    }
    res.json(filtered);
}
function getStatsRequest(req, res) {
    res.json(getStats());
}
function getIdRequest(req, res) {
    const exercise = exercisesData_1.exercisesDB.find((ex) => ex.id === req.params.id);
    if (!exercise)
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
    res.json(exercise);
}
function createExercise(req, res) {
    const newExercise = {
        id: Date.now().toString(),
        name: req.body.name,
        muscle: req.body.muscle,
        video: req.body.video || '',
        description: req.body.description || '',
        difficulty: req.body.difficulty || 'Principiante',
        equipment: req.body.equipment || '',
        instructions: req.body.instructions || [],
        createdAt: new Date().toISOString(),
    };
    exercisesData_1.exercisesDB.push(newExercise);
    res.status(201).json(newExercise);
}
function updateExercise(req, res) {
    const index = exercisesData_1.exercisesDB.findIndex((ex) => ex.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
    exercisesData_1.exercisesDB[index] = { ...exercisesData_1.exercisesDB[index], ...req.body };
    res.json(exercisesData_1.exercisesDB[index]);
}
function deleteExercise(req, res) {
    const index = exercisesData_1.exercisesDB.findIndex((ex) => ex.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
    const deleted = exercisesData_1.exercisesDB.splice(index, 1)[0];
    res.json({ message: 'Ejercicio eliminado', exercise: deleted });
}
function getStats() {
    const byMuscle = {};
    const byDifficulty = {};
    exercisesData_1.exercisesDB.forEach((ex) => {
        byMuscle[ex.muscle] = (byMuscle[ex.muscle] || 0) + 1;
        byDifficulty[ex.difficulty] = (byDifficulty[ex.difficulty] || 0) + 1;
    });
    return {
        totalExercises: exercisesData_1.exercisesDB.length,
        byMuscle,
        byDifficulty,
    };
}
