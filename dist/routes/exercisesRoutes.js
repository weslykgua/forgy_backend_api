"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExercisesRoutes = getExercisesRoutes;
const exercisesController_1 = require("../controllers/exercisesController");
const express_1 = require("express");
function getExercisesRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', exercisesController_1.getExercises);
    router.get('/stats', exercisesController_1.getStatsRequest);
    router.get('/:id', exercisesController_1.getIdRequest);
    router.post('/', exercisesController_1.createExercise);
    router.put('/:id', exercisesController_1.updateExercise);
    router.delete('/:id', exercisesController_1.deleteExercise);
    return router;
}
