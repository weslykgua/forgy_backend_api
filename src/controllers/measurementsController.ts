import { Request, Response } from 'express'
import { BodyMeasurement } from '../interfaces/BodyMeasurement'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().bodyMeasurement

export function getMeasurements(req: Request, res: Response) {
  res.json(prisma.findMany())
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
    createdAt: new Date().toISOString(),
  }
  prisma.create({
    data: newMeasurement
  })
    .then(createdMeasurement =>
      res.status(201).json(createdMeasurement)
    )
    .catch(error =>
      res.status(500).json({ error: error.message }
      )
    )
}
