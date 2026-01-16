import { Router } from 'express';
import { getMeasurements, createMeasurement } from '../controllers/measurementsController';

export function getMeasurementsRoutes() {
    const router = Router();

    router.get('/', getMeasurements);
    router.post('/', createMeasurement);

    return router;
}
