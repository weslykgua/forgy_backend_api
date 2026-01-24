
/*
import { Request, Response } from 'express'

export function validateToken(req: Request, res: Response, next: Function) {
    const token: { userId: string, from: string, until: string } | undefined = req.headers.authorization; // ToDo usar el token para obtener el userId

    if (token == undefined) {
        res.status(401).json({ error: 'No tiene permiso' })

        return
    }

    console.log("Token rutina", token);
    req.body.token = token;
    next();
}
    */