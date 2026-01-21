"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressRoutes = getProgressRoutes;
const express_1 = require("express");
const progressController_1 = require("../controllers/progressController");
function getProgressRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', progressController_1.getProgress);
    router.get('/stats', progressController_1.getProgressStats);
    router.get('/:date', progressController_1.getProgressByDate);
    router.post('/', progressController_1.createProgress);
    router.delete('/:id', progressController_1.deleteProgress);
    return router;
}
