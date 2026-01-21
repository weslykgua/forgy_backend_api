"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutsRoutes = getWorkoutsRoutes;
const express_1 = require("express");
const workoutsController_1 = require("../controllers/workoutsController");
function getWorkoutsRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', workoutsController_1.getWorkouts);
    router.get('/history', workoutsController_1.getWorkoutHistory);
    router.get('/prs', workoutsController_1.getPersonalRecords);
    router.get('/calendar', workoutsController_1.getWorkoutCalendar);
    router.get('/:id', workoutsController_1.getWorkoutById);
    router.post('/', workoutsController_1.createWorkout);
    router.put('/:id', workoutsController_1.updateWorkout);
    router.delete('/:id', workoutsController_1.deleteWorkout);
    return router;
}
