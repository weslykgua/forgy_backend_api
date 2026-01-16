import { Request, Response } from 'express';
import { BodyMeasurement } from '../interfaces/BodyMeasurement';
import { bodyMeasurementsDB } from '../data/measurementsData';

export function getMeasurements(req: Request, res: Response) {
    res.json(bodyMeasurementsDB);
}

export function createMeasurement(req: Request, res: Response) {
    const newMeasurement: BodyMeasurement = {
        id: Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        chest: req.body.chest || 0,
        waist: req.body.waist || 0,
        hips: req.body.hips || 0,
        bicepLeft: req.body.bicepLeft || 0,
        bicepRight: req.body.bicepRight || 0,
        thighLeft: req.body.thighLeft || 0,
        thighRight: req.body.thighRight || 0,
        createdAt: new Date().toISOString()
    };
    bodyMeasurementsDB.push(newMeasurement);
    res.status(201).json(newMeasurement);
}
