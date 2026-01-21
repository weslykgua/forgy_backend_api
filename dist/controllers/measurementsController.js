"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasurements = getMeasurements;
exports.createMeasurement = createMeasurement;
const measurementsData_1 = require("../data/measurementsData");
function getMeasurements(req, res) {
    res.json(measurementsData_1.bodyMeasurementsDB);
}
function createMeasurement(req, res) {
    const newMeasurement = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        chest: req.body.chest || 0,
        waist: req.body.waist || 0,
        hips: req.body.hips || 0,
        bicepLeft: req.body.bicepLeft || 0,
        bicepRight: req.body.bicepRight || 0,
        thighLeft: req.body.thighLeft || 0,
        thighRight: req.body.thighRight || 0,
        createdAt: new Date().toISOString(),
    };
    measurementsData_1.bodyMeasurementsDB.push(newMeasurement);
    res.status(201).json(newMeasurement);
}
