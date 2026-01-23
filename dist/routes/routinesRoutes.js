"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutinesRoutes = getRoutinesRoutes;
const express_1 = require("express");
const routinesController_1 = require("../controllers/routinesController");
function getRoutinesRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', routinesController_1.getRoutines);
    //router.get('/:id', getRoutineById)
    router.post('/', routinesController_1.createRoutine);
    //router.put('/:id', updateRoutine)
    router.delete('/:id', routinesController_1.deleteRoutine);
    router.post('/:id/exercises', routinesController_1.addExerciseToRoutine);
    router.delete('/:id/exercises/:exerciseId', routinesController_1.removeExerciseFromRoutine);
    return router;
}
