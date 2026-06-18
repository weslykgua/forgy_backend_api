import { Router, Request, Response } from 'express'
import { validateToken } from '../controllers/authenticationController'
import prisma from '../config/database'

export function getDashboardRoutes() {
    const router = Router()

    // Obtener métricas generales
    router.get('/', validateToken, async (req: Request, res: Response) => {
        try {
            const userId = req.body.token.userId
            // Cuenta el total de entrenamientos para calcular el "nivel" del usuario
            const totalWorkouts = await prisma.trainingSession.count({ where: { userId } })

            res.json({ totalWorkouts })
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el dashboard' })
        }
    })

    return router
}