import { getExercises, getStatsRequest } from "../controllers/exercisesController";
import { Router } from 'express';


export function getExercisesRoutes() {
    const router = Router()

    router.get('/', getExercises)
    router.get('/exercises/stats', getStatsRequest);

router.get('/exercises/:id', (req: Request, res: Response) => {
    const exercise = exercisesDB.find(ex => ex.id === req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado' });
    res.json(exercise);
});

router.post('/exercises', (req: Request, res: Response) => {
    const newExercise: Exercise = {
        id: Date.now().toString(),
        name: req.body.name,
        muscle: req.body.muscle,
        video: req.body.video || '',
        description: req.body.description || '',
        difficulty: req.body.difficulty || 'Principiante',
        equipment: req.body.equipment || '',
        instructions: req.body.instructions || [],
        createdAt: new Date().toISOString()
    };
    exercisesDB.push(newExercise);
    io.emit('exercises-updated', { action: 'created', exercise: newExercise });
    res.status(201).json(newExercise);
});

router.put('/exercises/:id', (req: Request, res: Response) => {
    const index = exercisesDB.findIndex(ex => ex.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' });

    exercisesDB[index] = { ...exercisesDB[index], ...req.body };
    io.emit('exercises-updated', { action: 'updated', exercise: exercisesDB[index] });
    res.json(exercisesDB[index]);
});

router.delete('/exercises/:id', (req: Request, res: Response) => {
    const index = exercisesDB.findIndex(ex => ex.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Ejercicio no encontrado' });

    const deleted = exercisesDB.splice(index, 1)[0];
    io.emit('exercises-updated', { action: 'deleted', exerciseId: req.params.id });
    res.json({ message: 'Ejercicio eliminado', exercise: deleted });
});

    return router
}