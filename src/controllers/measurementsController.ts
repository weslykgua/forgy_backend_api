import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getMeasurements(req: Request, res: Response) {
  try {
    const userId = (req as any).token.userId as string

    const data = await prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    })

    res.json(data)
  } catch {
    res.status(500).json({ error: 'Error al obtener mediciones' })
  }
}

export async function createMeasurement(req: Request, res: Response) {
  try {
    const measurement = await prisma.bodyMeasurement.create({
      data: {
        date: new Date(req.body.date),
        userId: req.body.userId,
        weight: req.body.weight,
        bodyFat: req.body.bodyFat,
        chest: req.body.chest,
        waist: req.body.waist,
        hips: req.body.hips,
        bicepLeft: req.body.bicepLeft,
        bicepRight: req.body.bicepRight,
        thighLeft: req.body.thighLeft,
        thighRight: req.body.thighRight,
        calves: req.body.calves,
        neck: req.body.neck,
        shoulders: req.body.shoulders
      }
    })

    res.status(201).json(measurement)
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar medición' })
  }
}