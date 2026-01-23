"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutines = getRoutines;
exports.createRoutine = createRoutine;
exports.addExerciseToRoutine = addExerciseToRoutine;
exports.deleteRoutine = deleteRoutine;
exports.removeExerciseFromRoutine = removeExerciseFromRoutine;
const migrate_data_1 = require("../scripts/migrate-data");
/**
 * GET /routines
 * Obtiene todas las rutinas con sus ejercicios
 */
async function getRoutines(req, res) {
    try {
        const routines = await migrate_data_1.prisma.routine.findMany({
            orderBy: { createdAt: 'desc' },
            include: { exercises: true }
        });
        res.json(routines);
    }
    catch (error) {
        console.error('Error getting routines:', error);
        res.status(500).json({ message: 'Error al obtener rutinas' });
    }
}
/**
 * POST /routines
 * Crea una nueva rutina
 */
async function createRoutine(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'El nombre es obligatorio' });
        }
        const routine = await migrate_data_1.prisma.routine.create({
            data: { name }
        });
        res.status(201).json(routine);
    }
    catch (error) {
        console.error('Error creating routine:', error);
        res.status(500).json({ message: 'Error al crear rutina' });
    }
}
/**
 * POST /routines/:id/exercises
 * Agrega un ejercicio a una rutina
 */
async function addExerciseToRoutine(req, res) {
    try {
        const { id } = req.params;
        const { exerciseId } = req.body;
        if (!exerciseId) {
            return res.status(400).json({ message: 'exerciseId es obligatorio' });
        }
        const routineId = Array.isArray(id) ? id[0] : id;
        const routine = await migrate_data_1.prisma.routine.findUnique({
            where: { id: routineId }
        });
        if (!routine) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }
        await migrate_data_1.prisma.routine.update({
            where: { id: routineId },
            data: {
                exercises: {
                    connect: { id: exerciseId }
                }
            }
        });
        res.json({ message: 'Ejercicio agregado a la rutina' });
    }
    catch (error) {
        console.error('Error adding exercise to routine:', error);
        res.status(500).json({ message: 'Error al agregar ejercicio' });
    }
}
/**
 * DELETE /routines/:id
 * Elimina una rutina completa
 */
async function deleteRoutine(req, res) {
    try {
        const { id } = req.params;
        const routineId = Array.isArray(id) ? id[0] : id;
        const routine = await migrate_data_1.prisma.routine.findUnique({
            where: { id: routineId }
        });
        if (!routine) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }
        await migrate_data_1.prisma.routine.delete({
            where: { id: routineId }
        });
        res.json({ message: 'Rutina eliminada correctamente' });
    }
    catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ message: 'Error al eliminar rutina' });
    }
}
/**
 * DELETE /routines/:id/exercises/:exerciseId
 * Quita un ejercicio de una rutina
 */
async function removeExerciseFromRoutine(req, res) {
    try {
        const { id, exerciseId } = req.params;
        const routineId = Array.isArray(id) ? id[0] : id;
        const exId = Array.isArray(exerciseId) ? exerciseId[0] : exerciseId;
        const routine = await migrate_data_1.prisma.routine.findUnique({
            where: { id: routineId }
        });
        if (!routine) {
            return res.status(404).json({ message: 'Rutina no encontrada' });
        }
        await migrate_data_1.prisma.routine.update({
            where: { id: routineId },
            data: {
                exercises: {
                    disconnect: { id: exId }
                }
            }
        });
        res.json({ message: 'Ejercicio eliminado de la rutina' });
    }
    catch (error) {
        console.error('Error removing exercise from routine:', error);
        res.status(500).json({ message: 'Error al quitar ejercicio' });
    }
}
