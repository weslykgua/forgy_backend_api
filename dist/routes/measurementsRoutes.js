"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasurementsRoutes = getMeasurementsRoutes;
const express_1 = require("express");
const measurementsController_1 = require("../controllers/measurementsController");
function getMeasurementsRoutes() {
    const router = (0, express_1.Router)();
    router.get('/', measurementsController_1.getMeasurements);
    router.post('/', measurementsController_1.createMeasurement);
    return router;
}
