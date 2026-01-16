import { Router } from 'express';
import {
    getProgress,
    getProgressByDate,
    getProgressStats,
    createProgress,
    deleteProgress
} from '../controllers/progressController';

export function getProgressRoutes() {
    const router = Router();

    router.get('/', getProgress);
    router.get('/stats', getProgressStats);
    router.get('/:date', getProgressByDate);
    router.post('/', createProgress);
    router.delete('/:id', deleteProgress);

    return router;
}
